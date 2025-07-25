import { animated, useSpring } from "@react-spring/web";

import React, { Ref } from "react";

const MotionDivY = ({
  children,
  keyValue,
  className = "",
  ref,
}: {
  children: React.ReactNode;
  keyValue?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}) => {
  const styles = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { duration: 250 }, // время анимации
  });

  return (
    <animated.div
      style={styles}
      key={keyValue || ""}
      className={className}
      ref={ref}
    >
      {children}
    </animated.div>
  );
};

export default MotionDivY;
