import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { useSession, getSession, status } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import Layout from "@/components/Layout/Layout";

export default function UploadPage({ isAllowed }) {
  const [imageSrc, setImageSrc] = useState();
  const [description, setDescription] = useState();
  const [retroUrl, setRetroUrl] = useState();
  const { data: sessionData, status } = useSession();
  const [errorMessage, setErrorMessage] = useState(null);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") {
    return null;
  }

  function handleOnChange(changeEvent) {
    const file = changeEvent.target.files[0];
    const maxSizeMB = 3; // Maximum file size in MB
    const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert to bytes
    const reader = new FileReader();

    if (file) {
      if (file.size > maxSizeBytes) {
        // File exceeds the maximum size
        setErrorMessage(`File size exceeds the ${maxSizeMB} MB limit.`);
        setImageSrc(null); // Remove image preview
      } else {
        // File size is valid, proceed
        setErrorMessage(null);

        const reader = new FileReader();
        reader.onload = function (onLoadEvent) {
          setImageSrc(onLoadEvent.target.result); // Set image preview
        };
        reader.readAsDataURL(file);
      }
    }
  }

  async function handleClickGenerate(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const description = `16-Bit retro videogame style pixel art image of: ${data.prompt}`;

    const response = await fetch("/api/openai-dalle2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: description }),
    });

    const result = await response.json();
    setRetroUrl(result.imageUrl);
  }

  async function handleClickUpload(e) {
    // trigger both uploads in parallel
    const [responseRetro, responseLocal] = await Promise.all([
      fetch("/api/cloudinary/upload-from-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retroUrl }),
      }),
      fetch("/api/cloudinary/upload-from-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageSrc }),
      }),
    ]);

    const dataRetro = await responseRetro.json();
    const dataLocal = await responseLocal.json();

    if (responseRetro.ok && responseLocal.ok) {
      // Proceed with the final upload to MongoDB after both URLs are fetched
      const response = await fetch(`/api/mongodb/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: dataLocal.cloudinaryFotoUrl,
          retroImageUrl: dataRetro.cloudinaryRetroUrl,
        }),
      });

      if (response.ok) {
        console.log("Upload to MongoDB successful");
      } else {
        console.error("Failed to upload to MongoDB");
      }
    } else {
      console.error("One of the uploads to Cloudinary failed");
    }
  }

  if (!isAllowed) {
    return (
      <Layout>
        <div style={{ width: "300px" }}>
          <h1 style={{ textAlign: "center" }}>Access Denied</h1>
          <p style={{ textAlign: "center" }}>
            This feature can only be accessed by admins. Please switch to
            gallery or favorites page. Or <br /> <br />
            Contact the admin, if you want to test the upload and image
            generation feature.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <LoginLogoutButton />
        <h1>Image Uploader</h1>
        <p>Upload your original Image (max. 3MB)</p>
        <form method="post" onChange={handleOnChange}>
          <p>
            <input type="file" name="file" />
          </p>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {imageSrc && (
            <Image
              width={300}
              height={300}
              src={imageSrc}
              alt="your uploaded image"
              style={{ objectFit: "cover" }}
            ></Image>
          )}
        </form>

        {imageSrc && (
          <>
            <h2>Pixel Image Generator</h2>
            <p>Pease describe briefly what can be seen in your Image.</p>
            <form
              style={{ width: "80%", height: "10rem" }}
              onSubmit={handleClickGenerate}
            >
              <label htmlFor="prompt">Prompt</label>
              <textarea
                type="text"
                id="prompt"
                name="prompt"
                maxLength={100}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  height: "6rem",
                  padding: "1rem",
                  border: "1px solid #ccc",
                  wordBreak: "break-all",
                }}
              />
              <button type="submit">Generate</button>
            </form>
          </>
        )}

        {retroUrl && (
          <Image
            width={300}
            height={300}
            src={retroUrl}
            alt="Generated Image"
            style={{
              height: "auto",
              margin: "0 auto",
            }}
          ></Image>
        )}
        {retroUrl && (
          <p>
            <button onClick={handleClickUpload}>Upload both Images</button>
          </p>
        )}
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // only users with allowed e-mail-address can access this feature
  const allowedEmails = process.env.ALLOWED_EMAILS?.split(",");

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const isAllowed = allowedEmails.includes(session.user.email);

  return {
    props: {
      isAllowed,
    },
  };
}
