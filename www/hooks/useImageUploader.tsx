import md5 from "js-md5";
import getApiUrl from "lib/getApiUrl";
import * as React from "react";
import { client } from "../lib/ApiClient";
import getImageDimensions from "../lib/getImageDimensions";

export type TBucketOptions = {
  Bucket: string;
};

export default function useImageUploader() {
  const [loading, setLoading] = React.useState(false);

  const upload: (
    files: (File | Blob)[],
    bucketOptions?: TBucketOptions
  ) => Promise<
    | {
        contentType: string;
        md5: string;
        height: number;
        width: number;
      }[]
    | undefined
  > = React.useCallback(
    async (files: (File | Blob)[], bucketOptions?: TBucketOptions) => {
      const images = files.filter((file) => /image/i.test(file.type));

      if (images.length) {
        try {
          setLoading(true);

          // 1. Calculate md5 has for image will enable us to dedupe already uploaded images
          const contents = await Promise.all(
            images.map((file) => getFileAndDigest(file))
          );

          const { presignedPostData } = await client.post(
            `${getApiUrl()}/api/images`,
            {
              contents,
              bucketOptions,
            }
          );

          await Promise.all(
            presignedPostData.map(
              (presignedData: { url: string; fields: any }, index: number) =>
                uploadFileToS3(
                  presignedData,
                  images[index],
                  bucketOptions && bucketOptions.Bucket
                )
            )
          );

          setLoading(false);

          return contents;
        } catch (error) {
          setLoading(false);
        }
      }
    },
    []
  );

  return {
    loading,
    upload,
  };
}

function getFileAndDigest(
  file: File | Blob
): Promise<{
  contentType: string;
  md5: string;
  height: number;
  width: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const formData = new FormData();
      formData.append("file", file);

      const dimensions = await getImageDimensions(file);

      resolve({
        contentType: file.type,
        md5: md5(reader.result as string),
        height: dimensions.height,
        width: dimensions.width,
      });
    };
    reader.onerror = async (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

const uploadFileToS3 = (
  presignedPostData: any,
  file: File | Blob,
  bucket?: string
) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    Object.keys(presignedPostData.fields).forEach((key) => {
      formData.append(key, presignedPostData.fields[key]);
    });

    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `https://${bucket || "shimmerapp"}.s3.amazonaws.com`,
      true
    );

    xhr.send(formData);
    xhr.onload = function () {
      this.status === 204 ? resolve() : reject(this.responseText);
    };
  });
};
