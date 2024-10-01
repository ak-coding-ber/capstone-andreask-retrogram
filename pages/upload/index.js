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

    formData.append("upload_preset", "ak-coding-ber");

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/ak-coding-ber/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    setImageSrc(data.secure_url);
    setUploadData(data);
    // request to an api route to create a new document in mongodb
  }

  return (
    <>
      <h1>This will be the foto upload page!</h1>
      <LoginLogoutButton />
      <div>
        <Head>
          <title>Image Uploader</title>
          <meta name="description" content="Upload your image to Cloudinary!" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h1>Image Uploader</h1>

          <p>Upload your image to Cloudinary!</p>

          <form
            method="post"
            onChange={handleOnChange}
            onSubmit={handleOnSubmit}
          >
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
        </main>
      </div>
    </>
  );
}
