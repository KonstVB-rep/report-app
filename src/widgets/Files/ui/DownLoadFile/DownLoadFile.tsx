export default function DownloadFile() {
  const handleDownload = async () => {
    try {
      const response = await fetch("https://downloader.disk.yandex.ru/disk/9a35e6b51d15c879f584f82957bade02061965cca25f038aa50b5f44e6d8a6b8/67ed3ff5/InAIXruWAFZ7CVG8WUFanhfzFSUCfAmA964-uHmwjtAwd5hScf0HLH6cTjMX3ZvX0ktaFTIfHdE-tOp-TGXpOA%3D%3D?uid=1111553385&filename=%D0%9D%D0%B0%D1%88%D0%B8%20%D1%81%D0%B0%D0%B9%D1%82%D1%8B.txt-cm8yey1280001ua60au083nu6&disposition=attachment&hash=&limit=0&content_type=text%2Fplain&owner_uid=1111553385&fsize=14874&hid=8e3a0459d77ca930cdf760d0a5491118&media_type=text&tknv=v2&etag=121f865f5139391ca6bb6f74a85b243f", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Ошибка скачивания файла");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "example.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Ошибка скачивания:", error);
    }
  };

  return <button onClick={handleDownload}>Скачать файл</button>;
}