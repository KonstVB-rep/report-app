import React from "react";

const CardInfo = ({
  data,
  title,
}: {
  data: string | undefined | null;
  title: string;
}) => {

  return (
    <>
      {data ? (
        <p>
          <span className="text-sm first-letter:capitalize">{title}:</span>{" "}
          <span>{data}</span>
        </p>
      ) : null}
    </>
  );
};

export default CardInfo;
