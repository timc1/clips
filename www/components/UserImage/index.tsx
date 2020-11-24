import { css } from "@emotion/core";
import styled from "@emotion/styled";
import * as React from "react";
import { Button as ReakitButton } from "reakit/Button";
// @ts-ignore
import noProfileImage from "www/components/UserImage/no-profile-image.jpg";
import { accessibilityOutline } from "www/globalStyles";
import useMounted from "www/hooks/useMounted";

type TUseProfilePhotosize = "tiny" | "small" | "medium" | "large";

type Props = {
  size: TUseProfilePhotosize;
  src?: string;
  alt: string;
  onClick?: () => void;
  disabled?: boolean;
};

const sizes: { [key in TUseProfilePhotosize]: number } = {
  tiny: 20,
  small: 30,
  medium: 45,
  large: 60,
};

const UserImage = React.forwardRef(
  (
    props: Props,
    ref: React.RefObject<HTMLButtonElement> & React.RefObject<HTMLDivElement>
  ) => {
    const Wrapper = props.onClick ? Button : Container;

    const { size, ...rest } = props;

    return (
      <Wrapper size={sizes[props.size]} {...rest} ref={ref}>
        <Img src={props.src || noProfileImage} alt={props.alt} />
      </Wrapper>
    );
  }
);

export default UserImage;

type StyledProps = { size: number };

function sharedAttributes(props: StyledProps) {
  return css`
    padding: 0;
    position: relative;
    height: ${props.size}px;
    width: ${props.size}px;
    border: none;
    border-radius: 50%;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
      opacity: 0.5;
    }
  `;
}

const Button = styled(ReakitButton)<StyledProps>`
  cursor: pointer;
  outline: none;
  ${sharedAttributes};
  ${accessibilityOutline};
`;

const Container = styled.div<StyledProps>`
  ${sharedAttributes}
`;

const Img = styled.img`
  object-fit: cover;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  object-fit: cover;
  height: inherit;
  width: inherit;
`;
