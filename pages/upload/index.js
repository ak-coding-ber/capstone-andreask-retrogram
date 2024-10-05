import LoginLogoutButton from "@/components/LoginLogoutButton/LoginLogoutButton";
import { getSession } from "next-auth/react";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // If no session, redirect to homepage
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Continue with page rendering if authenticated
  return {
    props: { session },
  };
}

export default function UploadPage() {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  const [description, setDescription] = useState();
  const [retroUrl, setRetroUrl] = useState();
  const [isGenerating, setIsGenerating] = useState(false);

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);

    // for multiple files

    /*
    for (const file of e.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc((imgs) => [...imgs, reader.result]);
      };
      reader.onerror = () => {
        console.log(reader.error);
      };
    }
    */
  }

  /**
   * handleOnSubmit
   * @description Triggers when the main form is submitted
   */

  async function handleOnSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append(
      "upload_preset",
      `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`
    );

    const data = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    setImageSrc(data.secure_url);
    setUploadData(data);

    // request to an api route to create a new document in mongodb
    const response = await fetch(`/api/upload/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl: data.secure_url, // This is the URL you got from Cloudinary
      }),
    });
    if (response.ok) {
      console.log("All good. Response was ok.");
    } else {
      console.error(`Error: ${response.status}`);
    }
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
    const responseRetro = await fetch("/api/cloudinary/upload-from-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ retroUrl }),
    });

    const responseLocal = await fetch("/api/cloudinary/upload-from-local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageSrc }),
    });
  }

  return (
    <>
      <h1>This will be the foto upload page!</h1>
      <LoginLogoutButton />
      <Head>
        <title>Image Uploader</title>
        <meta name="description" content="Upload your image to Cloudinary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Image Uploader</h1>

        <p>Upload your original Image</p>

        <form method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>
          <p>
            <input type="file" name="file" />
          </p>

          <Image
            width={400}
            height={400}
            src={imageSrc}
            alt="your uploaded image"
            style={{ maxWidth: "100%", height: "auto" }}
          ></Image>
          {/* <img style={{ width: "400px" }} src={imageSrc} /> */}

          {imageSrc && !uploadData && (
            <p>
              <button>Upload Files</button>
            </p>
          )}

          {/* {uploadData && (
              <code>
                <pre>{JSON.stringify(uploadData, null, 2)}</pre>
              </code>
            )} */}
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
            <button onClick={handleClickUpload}>Upload generated File</button>
          </p>
        )}
      </main>
    </>
  );
}
