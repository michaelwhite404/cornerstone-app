import { Router } from "express";
import { authController } from "@controllers/v2";
import { catchAsync, sheets } from "@utils";
const { protect } = authController;

const router = Router();

router.use(protect);

router.get(
  "/idk",
  catchAsync(async (req, res /* , next */) => {
    res.json({ success: "success" });
  })
);

router.patch(
  "/update",
  catchAsync(async (req, res, next) => {
    const googleSheets = sheets("mwhite1@cornerstone-schools.org");
    // await googleSheets.spreadsheets.
    const r = await googleSheets.spreadsheets.batchUpdate({
      // spreadsheetId: "1Oa8NTCPG3L0oRZR43SgVpo7o6zhBjtvuXuOIuWQtITM",
      /* requestBody: {
        requests: [
          {
            updateDimensionProperties: {
              range: {
                sheetId: 0,
                dimension: "COLUMNS",
                startIndex: 0,
                endIndex: 4,
              },
              properties: {
                pixelSize: 160,
              },
              fields: "pixelSize",
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: 0,
              },
              properties: {
                pixelSize: 28,
              },
              fields: "pixelSize",
            },
          },
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startColumnIndex: 0,
                endColumnIndex: 4,
                startRowIndex: 0,
              },
              cell: {
                userEnteredFormat: {
                  verticalAlignment: "MIDDLE",
                  horizontalAlignment: "LEFT",
                  padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 8,
                  },
                },
              },
              fields: "userEnteredFormat(verticalAlignment,horizontalAlignment,padding)",
            },
          },
        ],
      }, */
      spreadsheetId: "10ckTe5ZqxpY4OFC-DmahTxF8ibS4YDgzmRQ8eTbi3PQ",
      requestBody: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId: 0,
                gridProperties: {
                  hideGridlines: true,
                },
              },
              fields: "gridProperties.hideGridlines",
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId: 0,
                dimension: "COLUMNS",
                startIndex: 0,
                endIndex: 4,
              },
              properties: {
                pixelSize: 172,
              },
              fields: "pixelSize",
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: 0,
              },
              properties: {
                pixelSize: 28,
              },
              fields: "pixelSize",
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: 0,
                endIndex: 1,
              },
              properties: {
                pixelSize: 56,
              },
              fields: "pixelSize",
            },
          },
          {
            mergeCells: {
              range: {
                sheetId: 0,
                startColumnIndex: 0,
                endColumnIndex: 4,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              mergeType: "MERGE_ALL",
            },
          },
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startColumnIndex: 0,
                endColumnIndex: 4,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  // #3c78d8
                  backgroundColor: {
                    red: 60 / 255,
                    green: 120 / 255,
                    blue: 216 / 255,
                  },
                  horizontalAlignment: "CENTER",
                  verticalAlignment: "MIDDLE",
                  textFormat: {
                    foregroundColor: {
                      red: 1,
                      green: 1,
                      blue: 1,
                    },
                    fontSize: 20,
                    fontFamily: "Kanit",
                    bold: true,
                  },
                },
              },
              fields:
                "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
            },
          },
          {
            mergeCells: {
              range: {
                sheetId: 0,
                startColumnIndex: 0,
                endColumnIndex: 4,
                startRowIndex: 1,
                endRowIndex: 2,
              },
              mergeType: "MERGE_ALL",
            },
          },
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startColumnIndex: 0,
                endColumnIndex: 4,
                startRowIndex: 1,
                endRowIndex: 2,
              },
              cell: {
                userEnteredFormat: {
                  // #1155cc
                  backgroundColor: {
                    red: 17 / 255,
                    green: 85 / 255,
                    blue: 204 / 255,
                  },
                  horizontalAlignment: "RIGHT",
                  verticalAlignment: "MIDDLE",
                  textFormat: {
                    foregroundColor: {
                      red: 1,
                      green: 1,
                      blue: 1,
                    },
                    fontSize: 10,
                    fontFamily: "Arial",
                    bold: true,
                  },
                  padding: {
                    top: 0,
                    right: 20,
                    bottom: 0,
                    left: 0,
                  },
                },
              },
              fields:
                "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,padding)",
            },
          },
          {
            mergeCells: {
              range: {
                sheetId: 0,
                startColumnIndex: 0,
                endColumnIndex: 2,
                startRowIndex: 2,
                endRowIndex: 3,
              },
              mergeType: "MERGE_ALL",
            },
          },
          {
            mergeCells: {
              range: {
                sheetId: 0,
                startColumnIndex: 2,
                endColumnIndex: 4,
                startRowIndex: 2,
                endRowIndex: 3,
              },
              mergeType: "MERGE_ALL",
            },
          },
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startColumnIndex: 0,
                endColumnIndex: 4,
                startRowIndex: 2,
                endRowIndex: 3,
              },
              cell: {
                userEnteredFormat: {
                  // #434343
                  backgroundColor: {
                    red: 67 / 255,
                    green: 67 / 255,
                    blue: 67 / 255,
                  },
                  horizontalAlignment: "CENTER",
                  verticalAlignment: "MIDDLE",
                  textFormat: {
                    foregroundColor: {
                      red: 1,
                      green: 1,
                      blue: 1,
                    },
                    fontSize: 10,
                    fontFamily: "Arial",
                    bold: true,
                  },
                },
              },
              fields:
                "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
            },
          },
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startColumnIndex: 0,
                endColumnIndex: 4,
                startRowIndex: 3,
                endRowIndex: 33,
              },
              cell: {
                userEnteredFormat: {
                  horizontalAlignment: "LEFT",
                  verticalAlignment: "MIDDLE",
                  textFormat: {
                    fontSize: 10,
                    fontFamily: "Arial",
                  },
                  padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 8,
                  },
                  borders: {
                    bottom: {
                      width: 1,
                      style: "SOLID",
                      color: {
                        red: 0,
                        green: 0,
                        blue: 0,
                      },
                    },
                  },
                },
              },
              fields:
                "userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment,padding,borders)",
            },
          },
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startColumnIndex: 0,
                endColumnIndex: 1,
                startRowIndex: 3,
                endRowIndex: 33,
              },
              cell: {
                userEnteredFormat: {
                  textFormat: {
                    bold: true,
                  },
                },
              },
              fields: "userEnteredFormat(textFormat)",
            },
          },
          {
            updateBorders: {
              range: {
                sheetId: 0,
                startColumnIndex: 0,
                endColumnIndex: 4,
                startRowIndex: 0,
                endRowIndex: 33,
              },
              top: {
                width: 2,
                style: "SOLID",
                color: {
                  red: 0,
                  green: 0,
                  blue: 0,
                },
              },
              ...["top", "bottom", "left", "right"].reduce((curr, next) => {
                curr[next] = {
                  width: 2,
                  style: "SOLID",
                  color: {
                    red: 0,
                    green: 0,
                    blue: 0,
                  },
                };
                return curr;
              }, {} as any),
            },
          },
        ],
      },
    });
    res.sendJson(200, r);
  })
);

export default router;
