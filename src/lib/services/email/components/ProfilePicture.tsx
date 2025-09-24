import { Img, Section } from "@react-email/components";

interface ProfilePictureProps {
  imageUrl: string;
  alt: string;
  size?: number;
}

export function ProfilePicture({ imageUrl, alt, size = 80 }: ProfilePictureProps) {
  return (
    <Section style={containerStyle}>
      <Img src={imageUrl} alt={alt} width={size} height={size} style={imageStyle} />
    </Section>
  );
}

const containerStyle = {
  textAlign: "center" as const,
  margin: "0 0 16px 0",
};

const imageStyle = {
  borderRadius: "50%",
  border: "3px solid #ff6b35",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};
