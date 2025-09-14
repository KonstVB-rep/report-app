import React from "react";

import { Mail, Phone } from "lucide-react";

type Props = {
  email: string;
  phone: string;
  className: string;
};

const Contacts = ({ email, phone, className }: Props) => {
  const baseClass = `flex h-14 flex-1 shrink-0 sm:aspect-square items-center justify-center border border-solid border-transparent bg-muted p-2.5 ${className}`;

  return (
    <>
      {email && (
        <a
          href={`mailto:${email}`}
          className={`${baseClass} hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background`}
        >
          <Mail size="24" />
        </a>
      )}

      {phone && (
        <>
          <a
            href={`tel:+${phone.replace(/[^0-9]/g, "")}`}
            className={`${baseClass} hover:bg-blue-600 hover:text-white focus-visible:bg-blue-600 focus-visible:text-white`}
          >
            <Phone size="24" />
          </a>

          <a
            href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${baseClass} hover:border-chart-2 hover:bg-green-600 hover:text-white focus-visible:bg-green-600 focus-visible:text-white`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144l-2.494.654l.666-2.433l-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931a6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646c-.182-.065-.315-.099-.445.099c-.133.197-.513.646-.627.775c-.114.133-.232.148-.43.05c-.197-.1-.836-.308-1.592-.985c-.59-.525-.985-1.175-1.103-1.372c-.114-.198-.011-.304.088-.403c.087-.088.197-.232.296-.346c.1-.114.133-.198.198-.33c.065-.134.034-.248-.015-.347c-.05-.099-.445-1.076-.612-1.47c-.16-.389-.323-.335-.445-.34c-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992c.47.205.84.326 1.129.418c.475.152.904.129 1.246.08c.38-.058 1.171-.48 1.338-.943c.164-.464.164-.86.114-.943c-.049-.084-.182-.133-.38-.232" />
            </svg>
          </a>
        </>
      )}
    </>
  );
};

export default Contacts;
