interface WriteIconProps {
  className?: string;
}

export const WriteIcon = ({ className }: WriteIconProps) => {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.00004 2.66602H4.60004C3.1641 2.66602 2.00004 3.83008 2.00004 5.26602V11.3994C2.00004 12.8353 3.1641 13.9993 4.60004 13.9993H10.7334C12.1693 13.9993 13.3334 12.8353 13.3334 11.3993V7.99935"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M13.3332 3.99992L6.99996 10.3333H5.66663V9L12 2.66667C12.1817 2.48494 12.2725 2.39408 12.3706 2.34551C12.5571 2.25305 12.7761 2.25306 12.9627 2.34552C13.0607 2.39411 13.1515 2.48497 13.3333 2.66671C13.5149 2.84843 13.6058 2.93928 13.6544 3.03729C13.7468 3.22382 13.7468 3.44283 13.6543 3.62936C13.6058 3.72736 13.5149 3.81821 13.3332 3.99992Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
};
