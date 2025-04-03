import { useEffect, useState } from "react";

export default function FileList() {
  const [files, setFiles] = useState<{ name: string }[]>([]);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await fetch("/api/yandex-disk/files");
        const data = await response.json();
        if (data.files) setFiles(data.files._embedded.items);
      } catch (error) {
        console.error("Ошибка загрузки списка файлов:", error);
      }
    }
    fetchFiles();
  }, []);

  return (
    <div>
      <h2>Список файлов</h2>
      <ul>
        {files.map((file) => (
          <li key={file?.name}>{file?.name}</li>
        ))}
      </ul>
    </div>
  );
}
