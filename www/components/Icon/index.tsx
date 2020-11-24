/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { TIcon, TIconSize } from "lib/types";
import * as React from "react";
import UnstyledButton from "../Button/UnstyledButton";
import CaretFilledUp from "./svgs/CaretFilledUp";
import CaretLeft from "./svgs/CaretLeft";
import CaretRight from "./svgs/CaretRight";
import Checkmark from "./svgs/Checkmark";
import Command from "./svgs/Command";
import Comment from "./svgs/Comment";
import ExclamationMark from "./svgs/ExclamationMark";
import ExclamationMarkInCircle from "./svgs/ExclamationMarkInCircle";
import Exit from "./svgs/Exit";
import EyeInvisible from "./svgs/EyeInvisible";
import EyeVisible from "./svgs/EyeVisible";
import HorizontalOverflow from "./svgs/HorizontalOverflow";
import LightningBolt from "./svgs/LightningBolt";
import LightningBoltFilled from "./svgs/LightningBoltFilled";
import Lock from "./svgs/Lock";
import Logo from "./svgs/Logo";
import MarkdownBold from "./svgs/MarkdownBold";
import MarkdownBulletList from "./svgs/MarkdownBulletList";
import MarkdownH1 from "./svgs/MarkdownH1";
import MarkdownH2 from "./svgs/MarkdownH2";
import MarkdownItalic from "./svgs/MarkdownItalic";
import MarkdownLink from "./svgs/MarkdownLink";
import MarkdownOrderedList from "./svgs/MarkdownOrderedList";
import MarkdownStrikethrough from "./svgs/MarkdownStrikethrough";
import MarkdownUnderline from "./svgs/MarkdownUnderline";
import Menu from "./svgs/Menu";
import Plus from "./svgs/Plus";
import Search from "./svgs/Search";
import Text from "./svgs/Text";
import TextDraft from "./svgs/TextDraft";
import VerticalOverflow from "./svgs/VerticalOverflow";

type Props = {
  icon: TIcon;
  size?: TIconSize;
  style?: Object;
  fill?: string;
  onClick?: (event?: MouseEvent) => void;
  disabled?: boolean;
  tabIndex?: 0 | -1;
  title?: string;
};

const icons: { [k in TIcon]: any } = {
  "exclamation-mark": ExclamationMark,
  "exclamation-mark-in-circle": ExclamationMarkInCircle,
  "eye-visible": EyeVisible,
  "eye-invisible": EyeInvisible,
  checkmark: Checkmark,
  "caret-left": CaretLeft,
  "caret-right": CaretRight,
  search: Search,
  "vertical-overflow": VerticalOverflow,
  menu: Menu,
  "caret-filled-up": CaretFilledUp,
  plus: Plus,
  "markdown-bold": MarkdownBold,
  "markdown-italic": MarkdownItalic,
  "markdown-link": MarkdownLink,
  "markdown-h1": MarkdownH1,
  "markdown-h2": MarkdownH2,
  "markdown-bullet-list": MarkdownBulletList,
  "markdown-ordered-list": MarkdownOrderedList,
  "markdown-underline": MarkdownUnderline,
  "markdown-strikethrough": MarkdownStrikethrough,
  exit: Exit,
  "text-draft": TextDraft,
  text: Text,
  comment: Comment,
  "horizontal-overflow": HorizontalOverflow,
  "lightning-bolt": LightningBolt,
  "lightning-bolt-filled": LightningBoltFilled,
  lock: Lock,
  command: Command,
  logo: Logo,
};

const sizes: { [k in TIconSize]: string } = {
  default: "24px",
  small: "16px",
  medium: "32px",
  large: "48px",
};

export default function Icon(props: Props) {
  const {
    icon,
    size = "default",
    onClick,
    tabIndex,
    title,
    disabled,
    style,
    fill,
    ...rest
  } = props;
  const IconComponent = icons[props.icon];

  if (!IconComponent) {
    return null;
  }

  const Component = onClick ? (
    <UnstyledButton
      onClick={onClick}
      type="button"
      tabIndex={tabIndex}
      title={title}
      disabled={disabled}
      {...rest}
    >
      <IconComponent
        size={sizes[size]}
        css={style}
        fill={fill || "var(--textColor)"}
        title={title}
      />
    </UnstyledButton>
  ) : (
    <IconComponent
      size={sizes[size]}
      style={style}
      fill={fill || "var(--textColor)"}
    />
  );

  return Component;
}

export const IconWithRef = React.forwardRef((props: Props, ref: any) => (
  <div
    ref={ref}
    css={css`
      display: inline-flex;
    `}
  >
    <Icon {...props} />
  </div>
));
