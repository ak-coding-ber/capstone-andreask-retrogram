import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { useSession, status } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import Layout from "@/components/Layout/Layout";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UploadPage() {
  const [imageSrc, setImageSrc] = useState();
  const [description, setDescription] = useState();
  const [retroUrl, setRetroUrl] = useState();
  const { data: sessionData, status } = useSession();
  // const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to homepage
    }
  }, [status, router]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") {
    return null;
  }

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  async function handleClickGenerate(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    console.log(data.prompt);

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

  return (
    <>
      <Layout>
        <h1>This will be the foto upload page!</h1>
        <LoginLogoutButton />
        <h1>Image Uploader</h1>
        <p>Upload your original Image</p>
        <form method="post" onChange={handleOnChange}>
          <p>
            <input type="file" name="file" />
          </p>
          {imageSrc && (
            <Image
              width={512}
              height={512}
              src={imageSrc}
              alt="your uploaded image"
              style={{ maxWidth: "100%" }}
            ></Image>
          )}
        </form>
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
        {retroUrl && (
          <Image
            width={512}
            height={512}
            src={retroUrl}
            alt="Generated Image"
            style={{
              maxWidth: "100%",
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
