"use client";

import { animated, useTransition } from "@react-spring/web";

const PageTransitionY = ({ children }: { children: React.ReactNode }) => {
  const transitions = useTransition(children, {
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 300 },
  });

  return (
    <>
      {transitions((styles, item) => (
        <animated.div style={styles} className="h-full w-full overflow-auto">
          {item}
        </animated.div>
      ))}
    </>
  );
};

export default PageTransitionY;
