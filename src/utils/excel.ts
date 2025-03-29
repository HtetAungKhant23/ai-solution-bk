import * as Excel from 'exceljs';
import { v4 as uuidv4 } from 'uuid';

export const excelExport = async (
  columns: {
    header: string;
    key: string;
    width: number;
  }[],
  rows: any,
  title: string,
) => {
  try {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(title, {
      pageSetup: {
        paperSize: 9,
        orientation: 'landscape',
      },
    });

    worksheet.mergeCells('A1', 'J1');
    worksheet.getCell('A1').value = title;
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.getRow(1).height = 30;

    worksheet.getRow(3).values = columns.map((col) => col.header);
    const headerRow = worksheet.getRow(3);
    headerRow.height = 25;

    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.columns = columns.map((col) => ({
      key: col.key,
      width: col.width,
    }));

    worksheet.addRows(rows);

    const fileName: string = uuidv4();
    const buffer = await workbook.xlsx.writeBuffer();

    return { buffer, excelFileName: `${fileName}.xlsx` };
  } catch (err) {
    console.log('Error saving Excel file:', err);
    return err;
  }
};
