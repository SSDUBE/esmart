import React from 'react';
// import * as fs from 'fs';
import * as docx from 'docx';
// const fs = require('fs')
import { saveAs } from 'file-saver';

interface ITableData {
  firstName: string;
  lastName: string;
  idNumber: string;
  score: string;
  createdAt: string;
  classID: number;
}

export const downloadWord = (leaderboardData: ITableData[]) => {
  const tableRows = leaderboardData.map((item) => {
    return new docx.TableRow({
      children: [
        new docx.TableCell({
          width: {
            size: 3505,
            type: docx.WidthType.DXA,
          },
          children: [new docx.Paragraph(item.firstName)],
        }),
        new docx.TableCell({
          width: {
            size: 5505,
            type: docx.WidthType.DXA,
          },
          children: [new docx.Paragraph(item.lastName)],
        }),
        new docx.TableCell({
          width: {
            size: 5505,
            type: docx.WidthType.DXA,
          },
          children: [new docx.Paragraph(item.idNumber)],
        }),
        new docx.TableCell({
          width: {
            size: 5505,
            type: docx.WidthType.DXA,
          },
          children: [new docx.Paragraph(item.score)],
        }),
        new docx.TableCell({
          width: {
            size: 5505,
            type: docx.WidthType.DXA,
          },
          children: [new docx.Paragraph(item.classID.toString())],
        }),
        new docx.TableCell({
          width: {
            size: 5505,
            type: docx.WidthType.DXA,
          },
          children: [new docx.Paragraph(item.createdAt)],
        }),
      ],
    });
  });

  const table = new docx.Table({
    columnWidths: [3505, 5505],
    rows: [
      ...tableRows
      // new docx.TableRow({
      //   children: [
      //     new docx.TableCell({
      //       width: {
      //         size: 3505,
      //         type: docx.WidthType.DXA,
      //       },
      //       children: [new docx.Paragraph('Hello')],
      //     }),
      //     new docx.TableCell({
      //       width: {
      //         size: 5505,
      //         type: docx.WidthType.DXA,
      //       },
      //       children: [],
      //     }),
      //   ],
      // }),
      // new docx.TableRow({
      //   children: [
      //     new docx.TableCell({
      //       width: {
      //         size: 3505,
      //         type: docx.WidthType.DXA,
      //       },
      //       children: [new docx.Paragraph('Students')],
      //     }),
      //     new docx.TableCell({
      //       width: {
      //         size: 5505,
      //         type: docx.WidthType.DXA,
      //       },
      //       children: [new docx.Paragraph('World')],
      //     }),
      //   ],
      // }),
    ],
  });

  const doc = new docx.Document({
    sections: [
      {
        children: [
          new docx.Paragraph({ text: 'Student leaderboard report' }),
          table,
        ],
      },
    ],
  });

  docx.Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "Leaderboard-Report.docx");
  });
};
