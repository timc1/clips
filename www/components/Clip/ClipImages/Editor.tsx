import { css } from "@emotion/core";
import styled from "@emotion/styled";
import getApiUrl from "lib/getApiUrl";
import { TClip, TImage } from "lib/types";
import { isValidImageUrl, parseUrl } from "lib/url";
import * as React from "react";
import { debounce } from "throttle-debounce";
import SquareButton from "www/components/Button/SquareButton";
import Icon from "www/components/Icon";
import Image from "www/components/Image";
import Input from "www/components/Input";
import MarkdownEditor from "www/components/MarkdownEditor";
import Spacer from "www/components/Spacer";
import useImageUploader from "www/hooks/useImageUploader";
import { SubmitButton } from "../shared";
import useSaveClip from "../useSaveClip";

type Props = {
  clip?: TClip;
};

export default function ClipImagesEditor(props: Props) {
  const [images, setImages] = React.useState<TImage[]>(
    props.clip ? props.clip.images : []
  );

  const { loading, upload } = useImageUploader();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [editingIndex, setEditingIndex] = React.useState<number>(-1);

  const handleImageInputChange = React.useCallback(
    async (event) => {
      const files: File[] = Array.from(event.target.files);

      event.target.value = "";

      const contents = await upload(files);

      if (contents) {
        setImages((images) => [
          ...images,
          ...contents.map((c) => ({
            key: c.md5,
            height: c.height,
            width: c.width,
          })),
        ]);
      } else {
        console.log("error uploading");
      }
    },
    [upload]
  );

  const handleScrollToBottom = React.useCallback(() => {
    const node = ref.current;

    if (node) {
      setTimeout(() => {
        node.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 400);
    }
  }, []);

  const [unfurling, setUnfurling] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const unfurl = React.useCallback(
    async (url: string) => {
      if (!url.length || unfurling) {
        return;
      }

      const parsedUrl = parseUrl(url);
      const isValid = isValidImageUrl(parsedUrl);

      if (isValid) {
        try {
          setUnfurling(true);

          const image = await window
            .fetch(url)
            .then((response) => response.blob());

          const contents = await upload([image]);

          if (contents) {
            setImages([
              ...images,
              ...contents.map((c) => ({
                key: c.md5,
                height: c.height,
                width: c.width,
              })),
            ]);

            setInputValue("");
          } else {
            console.log("error unfurling");
          }

          setUnfurling(false);
        } catch (error) {
          setUnfurling(false);
        }
      }
    },
    [images, unfurling, upload]
  );

  const handleUnfurl = React.useCallback(debounce(1000, unfurl), [unfurl]);

  const handleImmediateUnfurl = React.useCallback(
    (event) => {
      event.preventDefault();
      handleUnfurl.cancel();
      unfurl(inputValue);
    },
    [handleUnfurl, inputValue, unfurl]
  );

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<any>) => {
      const value = event.target ? event.target.value : "";
      setInputValue(value);
      handleUnfurl(value);
    },
    [handleUnfurl]
  );

  const { saving, submitClip } = useSaveClip({
    clipId: props.clip && props.clip.id,
  });

  const handleSubmit = React.useCallback(async () => {
    submitClip({ type: "image", images });
  }, [images, submitClip]);

  const onRequestClose = React.useCallback(() => {
    setEditingIndex(-1);
  }, []);

  const inputRef = React.useRef(null);

  const handleToggleInput = React.useCallback((event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current.click();
    }
  }, []);

  const handleOnToggleEdit = React.useCallback(
    (index: number) => () => {
      setEditingIndex(index);
    },
    []
  );

  return (
    <>
      <Container>
        <FormContainer>
          <Form onSubmit={handleImmediateUnfurl}>
            <Input
              value={inputValue}
              onChange={handleInputChange}
              autoFocus
              placeholder="Enter an image url…"
              disabled={loading || unfurling}
              isLoading={loading || unfurling}
            />
          </Form>
          <Form>
            <PhotoImageInput
              ref={inputRef}
              id="photo-input"
              type="file"
              name="image"
              accept="image/jpg, image/jpeg, image/png, image/gif"
              multiple
              tabIndex={-1}
              onChange={handleImageInputChange}
            />
            <PhotoImageLabel
              htmlFor="photo-input"
              tabIndex={0}
              onKeyDown={handleToggleInput}
            >
              Open…
            </PhotoImageLabel>
          </Form>
        </FormContainer>
        {images.length ? (
          <>
            <Ul>
              {images.map((image, index) => {
                return (
                  <li key={image.key}>
                    <ImageEditor
                      defaultValue={image.description}
                      onMarkdownChange={(value: string) => {
                        const clone = images.slice();
                        clone[index] = {
                          ...clone[index],
                          description: value,
                        };

                        setImages(clone);
                      }}
                      image={image}
                      isShowing={!!image.description || editingIndex === index}
                      isEditing={editingIndex === index}
                      isFocused={editingIndex === index}
                      handleScrollToBottom={
                        index === images.length - 1
                          ? handleScrollToBottom
                          : undefined
                      }
                      onToggleEdit={handleOnToggleEdit(index)}
                      onRemove={() =>
                        setImages((images) =>
                          images.filter(
                            (currentImage) => currentImage.key !== image.key
                          )
                        )
                      }
                      onRequestClose={onRequestClose}
                    />
                  </li>
                );
              })}
            </Ul>
            <SubmitButton
              onSubmit={handleSubmit}
              isLoading={saving}
              disabled={unfurling}
            />
          </>
        ) : null}
      </Container>
      <div ref={ref} />
    </>
  );
}

function ImageEditor({
  defaultValue = "",
  onMarkdownChange,
  image,
  isShowing,
  isEditing,
  isFocused,
  handleScrollToBottom,
  onToggleEdit,
  onRemove,
  onRequestClose,
}: {
  defaultValue?: string;
  onMarkdownChange: (value: string) => void;
  image: TImage;
  isShowing: boolean;
  isEditing: boolean;
  isFocused: boolean;
  handleScrollToBottom?: () => void;
  onToggleEdit: () => void;
  onRemove: () => void;
  onRequestClose: () => void;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const markdownRef = React.useRef<HTMLDivElement>(null);

  const url = `${getApiUrl()}/api/images?key=${image.key}`;

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onRequestClose();
      }
    }

    const container = containerRef.current;
    const markdown = markdownRef.current;
    if (isEditing) {
      if (container) {
        container.addEventListener("keydown", handleKeyDown);
      }

      if (markdown) {
        markdown.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }

    return () => {
      if (container) {
        container.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [isEditing, onRequestClose]);

  const handleMarkdownChange = React.useCallback(
    (value: string) => {
      onMarkdownChange(value);
    },
    [onMarkdownChange]
  );

  return (
    <>
      <ImageContainer ref={containerRef}>
        <Image
          url={url}
          height={image.height}
          width={image.width}
          onLoaded={handleScrollToBottom}
          render={
            <>
              <DescriptionButton
                aria-label="Add description"
                onClick={onToggleEdit}
              >
                <Icon icon="comment" />
              </DescriptionButton>
              <RemoveButton aria-label="Remove image" onClick={onRemove}>
                <Icon icon="exit" />
              </RemoveButton>
            </>
          }
        />
      </ImageContainer>
      {isEditing || isShowing ? (
        <div ref={markdownRef}>
          <Spacer spaces={2} />
          <MarkdownEditor
            defaultValue={defaultValue}
            placeholder="Add a caption…"
            isFocused={isFocused}
            onChange={handleMarkdownChange}
            large
          />
        </div>
      ) : null}
    </>
  );
}

const shared = css`
  position: absolute;
  bottom: calc(var(--unit) * 2);
  display: flex;
  cursor: pointer;
`;

const RemoveButton = styled(SquareButton)`
  left: calc(var(--unit) * 3.5 + 28px);
  ${shared}
`;

const DescriptionButton = styled(SquareButton)`
  left: calc(var(--unit) * 2);
  ${shared}
`;

const Container = styled.div``;

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px;
  gap: calc(var(--unit) * 2);
  align-items: center;
  position: sticky;
  top: calc(var(--unit) * 3);
  z-index: 1;
`;

const Form = styled.form`
  margin: 0;
`;

const PhotoImageInput = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
`;

const PhotoImageLabel = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  place-content: center;
  height: 100%;
  color: var(--textColor);
  font-weight: var(--fontWeightMedium);
  transition: all 100ms var(--ease);
  user-select: none;
  line-height: 1;
  overflow: hidden;
  height: 43px;
  cursor: pointer;
  outline: none;
  box-shadow: 0 0 0 3px transparent;
  font-family: var(--primaryFont);

  &:hover {
    color: var(--textColor);
  }

  &:focus[data-focus-visible-added] {
    box-shadow: 0 0 0 3px var(--accessibilityOutline);
  }
`;

const Ul = styled.ul`
  list-style: none;
  margin: 0;
  margin-top: calc(var(--unit) * 4);
  padding: calc(var(--unit) * 4);
  display: grid;
  gap: calc(var(--unit) * 2);
`;

const ImageContainer = styled.div`
  position: relative;

  @media (hover) {
    ${RemoveButton} {
      opacity: 0;

      &:focus {
        opacity: 1;
      }
    }

    &:hover {
      ${RemoveButton} {
        opacity: 1;
      }
    }
  }
`;
