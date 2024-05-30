const {readFile, mkdir, writeFile} = require("fs").promises;
const { existsSync } = require("fs");
const firstNewFileName = process.argv[2];
const howMany = process.argv[3] ? process.argv[3] : 1;
let dirPath = process.argv[4] ? process.argv[4] : "./";
let content = process.argv[5] ? process.argv[5] : "";

(async () => {
  if (
    !firstNewFileName ||
    isNaN(Number(howMany)) ||
    (content !== "" && !existsSync(content))
  ) {
    console.error(
      "YOU DID SOMETHING WRONG \nBEFORE USING THIS FILE READ README.MD FILE"
    );
    return;
  }

  if (content) {
    content = await readFile(content, "utf-8");
  }

  dirPath = dirPath[dirPath.length - 1] === "/" ? dirPath : dirPath + "/";
  if (dirPath !== "./" && !existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }

  let baseName = firstNewFileName.slice(0, firstNewFileName.lastIndexOf("."));
  let lastNumber = "";
  if (baseName.match(/[0-9]+$/)) {
    lastNumber = parseInt(baseName.match(/[0-9]+$/)[0], 10); // mastermind
    baseName = baseName.substring(0, baseName.lastIndexOf(lastNumber));
  }
  for (let i = 1; i <= Number(howMany); i++) {
    const extension = firstNewFileName.slice(firstNewFileName.lastIndexOf("."));
    const createdFile = `${dirPath}${baseName}${lastNumber}${extension}`;
    console.log("createdFile: ", createdFile);
    try {
      await writeFile(createdFile, content, "utf8");
      if (
        (baseName[baseName.length - 1] == 0 && lastNumber === "") ||
        (baseName[baseName.length - 1] == 0 &&
          String(lastNumber).endsWith("9") &&
          String(lastNumber).startsWith("9"))
      ) {
        baseName = baseName.slice(0, -1);
        lastNumber = Number(lastNumber);
      }
      lastNumber = Number(lastNumber) + 1;
    } catch (error) {
      console.error("something went wrong: ", error);
    }
  }
})();
