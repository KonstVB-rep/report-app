import { getAllBots } from "@/entities/tgBot/api";
import BotsList from "@/feature/telegramBot/ui/BotsList";


const BotsPage = async () => {
  try {
    const allBots = await getAllBots();

    return (
      <div className="p-5 grid [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))] gap-4 overflow-auto max-h-[94vh]">
        <BotsList bots={allBots} />
      </div>
    );
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
