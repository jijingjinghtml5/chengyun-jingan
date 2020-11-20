export function getStatus(status) {
  let str = status;
  switch (str) {
    case 1:
    case "1":
      str = "在岗";
      break;
    case 2:
    case "2":
      str = "离岗";
      break;
    case 3:
    case "3":
      str = "脱岗";
      break;
  }
  return str;
}

// 案件阶段
export const CaseSteps = ["发现", "立案", "派遣", "处置", "核查", "结案"]
;

// 紧急、超期
export const CaseStatusColor = ["#FCBF51", "#D0021B"];
