import { getAllBots } from "@/entities/tgBot/api";

import ClientBotsPage from "./ui/ClientBotsPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BotsPage = async () => {
  try {
    const allBots = await getAllBots();

    return <ClientBotsPage initialBots={allBots} />;
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return (
      <div className="p-5 min-h-screen grid place-items-center">
        <h1 className="text-2xl">Ошибка загрузки данных</h1>
      </div>
    );
  }
};

export default BotsPage;
