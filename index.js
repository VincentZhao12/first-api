const app = require("express")();
const PORT = 8080;
const fetch = require("node-fetch");
const cors = require("cors");
const { JSDOM } = require("jsdom");

const URLS = {
  august:
    "http://mvhs-fuhsd.org/john_conlin/CalcBC/HW_folder_BC/HW_21-22/BC_AugSept21.html",
  september:
    "http://mvhs-fuhsd.org/john_conlin/CalcBC/HW_folder_BC/HW_21-22/BC_AugSept21.html",
  october:
    "http://mvhs-fuhsd.org/john_conlin/CalcBC/HW_folder_BC/HW_21-22/BC_Oct21.html",
  november:
    "http://mvhs-fuhsd.org/john_conlin/CalcBC/HW_folder_BC/HW_21-22/BC_Nov21.html",
  december:
    "http://mvhs-fuhsd.org/john_conlin/CalcBC/HW_folder_BC/HW_21-22/BC_Dec21.html",
  january:
    "http://mvhs-fuhsd.org/john_conlin/CalcBC/HW_folder_BC/HW_21-22/BC_Jan22.html",
  febuary:
    "http://mvhs-fuhsd.org/john_conlin/CalcBC/HW_folder_BC/HW_21-22/BC_Feb22.html",
  march:
    "http://mvhs-fuhsd.org/john_conlin/CalcBC/HW_folder_BC/HW_21-22/BC_March22.html",
  april:
    "http://mvhs-fuhsd.org/john_conlin/CalcBC/HW_folder_BC/HW_21-22/BC_April22.html",
  may: "http://mvhs-fuhsd.org/john_conlin/CalcBC/HW_folder_BC/HW_21-22/BC_May22.html",
  june: "http://mvhs-fuhsd.org/john_conlin/CalcBC/HW_folder_BC/HW_21-22/BC_June22.html",
};

app.use(cors());

app.listen(PORT, () => console.log(`its alive on http://localhost:${PORT}`));

app.get("/assignments/:month", (req, res) => {
  const { month } = req.params;
  const url = URLS[month];
  fetchData(url)
    .then((assignments) => {
      res.status(200).send(assignments);
    })
    .catch((err) => res.send(404).send(err));
});

const fetchData = async (url) => {
  const res = await fetch(url, {});
  const text = await res.text();
  const dom = await new JSDOM(text);

  const doc = dom.window.document;

  let assignments = [];

  doc.querySelectorAll("table").forEach((element) => {
    const rows = element.children[0].children;
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].children;
      if (cols.length === 5) {
        const date = cols[1].innerHTML;
        const hwNum = cols[2].innerHTML;
        const sections = cols[3].innerHTML;
        const assignment = cols[4].innerHTML;

        assignments = [
          ...assignments,
          {
            date,
            hwNum,
            sections,
            assignment,
          },
        ];
      }
    }
  });
  return assignments;
};
