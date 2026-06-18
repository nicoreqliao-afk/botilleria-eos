import XLSX from "xlsx";

const path = process.argv[2];
const wb = XLSX.readFile(path);
console.log("Hojas:", wb.SheetNames);

for (const name of wb.SheetNames) {
  const ws = wb.Sheets[name];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false });
  console.log(`\n=== Hoja "${name}" — ${rows.length} filas ===`);
  console.log("Encabezado:", JSON.stringify(rows[0]));
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (r && r[1]) console.log(`${r[0] ?? ""} | ${r[1]} | ${r[2] ?? ""} | ${r[3] ?? ""}`);
  }
}
