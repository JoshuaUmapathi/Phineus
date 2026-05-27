"use client";

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table";

const data = [
  { name: "React", downloads: "15.2M", stars: "227K", license: "MIT" },
  { name: "Vue", downloads: "8.4M", stars: "236K", license: "MIT" },
  { name: "Angular", downloads: "3.1M", stars: "95K", license: "MIT" },
  { name: "Svelte", downloads: "2.7M", stars: "80K", license: "MIT" },
];

export default function TableDemo() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Table className="w-full max-w-2xl">
        <TableHeader>
          <TableRow>
            <TableHead>Framework</TableHead>
            <TableHead>Downloads</TableHead>
            <TableHead>Stars</TableHead>
            <TableHead>License</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={row.name} index={i}>
              <TableCell className="font-[inherit]">{row.name}</TableCell>
              <TableCell>{row.downloads}</TableCell>
              <TableCell>{row.stars}</TableCell>
              <TableCell>{row.license}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
