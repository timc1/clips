import { useRouter } from "next/router";
import * as React from "react";
import ClipImageEditor from "www/components/Clip/ClipImages/Editor";
import ClipLinkEditor from "www/components/Clip/ClipLink/Editor";
import ClipTextEditor from "www/components/Clip/ClipText/Editor";
import PageLayout from "www/components/Layout/PageLayout";
import TopBar from "www/components/Layout/TopBar";

export default function Type() {
  const { query } = useRouter();

  const { type } = query;

  return (
    <>
      <TopBar title="New Clip" />
      {type === "text" && <ClipTextEditor />}
      {type === "link" && <ClipLinkEditor />}
      {type === "image" && <ClipImageEditor />}
    </>
  );
}

Type.Layout = PageLayout;
