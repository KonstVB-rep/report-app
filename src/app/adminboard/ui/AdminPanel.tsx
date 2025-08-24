import React from "react";

import WrapperBots from "./Bot/ui/WrapperBots";
import WrapperChats from "./ChatsBot/ui/WrapperChats";

const AdminPanel = () => {
  return (
    <div className="p-5 flex flex-wrap gap-5">
      <WrapperBots />
      <WrapperChats />
    </div>
  );
};

export default AdminPanel;
