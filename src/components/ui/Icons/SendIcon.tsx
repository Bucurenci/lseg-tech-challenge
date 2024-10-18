import React from "react";

interface ChatBotIconProps extends React.SVGProps<SVGSVGElement>{
    color?: string;
    width?: number;
    height?: number;
}

export default function SendIcon({color = '#fff', width = 30, height = 30, ...props}: ChatBotIconProps) {
  return (
    <svg fill={color} width={width} height={height} {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill={color} d="M4.02 42l41.98-18-41.98-18-.02 14 30 4-30 4z"/>
        <path d="M0 0h48v48h-48z" fill="none"/>
    </svg>
  );
}