export const SvgIcon = ({ src, size = 16, style }: { src: string; size?: number; style?: React.CSSProperties }) => (
    <img src={src} alt="icon" style={{ width: size, height: size, ...style }} />
);