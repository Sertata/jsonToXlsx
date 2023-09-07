import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

function s2ab(s: string) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

function exportToExcel(jsonData: unknown[]) {
  const ws = XLSX.utils.json_to_sheet(jsonData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

  // Создаем ссылку на Blob и имитируем клик по ней,
  // чтобы начать загрузку
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = 'output.xlsx';
  a.click();
}

const jsonData = [
  { "Name": "John", "Age": 30, "City": "New York" },
  { "Name": "Jane", "Age": 40, "City": "Chicago" }
];


function App() {
  const [value, setValue] = useState<string>(JSON.stringify(jsonData));
  const divRef = useRef<HTMLDivElement>(null);

  const handleBlur = () => {
    if (divRef.current) {
      setValue(divRef.current.innerHTML);
    }
  };
  const downloadFile = () => {
    console.log(value)
    exportToExcel(JSON.parse(value));
  }
  return (
    <div >
      <div contentEditable
        onBlur={handleBlur}
        ref={divRef}
        dangerouslySetInnerHTML={{ __html: value }} style={{ border: '1px solid black',minHeight:'20vh' }}></div>
      <button onClick={downloadFile}>Download</button>
    </div>
  )
}

export default App
