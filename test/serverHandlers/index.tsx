import { handlers as userListHandler } from "./usersList";
import { handlers as viewAllDealsHandler } from "./viewAllDeals";
import { handlers as summaryPreviewHandler } from "./summaryPreview"
import { handlers as getRole } from "./getRole"
import { handlers as editDeal } from "./editDeal";
import { handlers as disablePromotion } from "./disablePromotion";
import { handlers as voucherList } from "./voucherList";

const allHandlers = [...userListHandler, ...viewAllDealsHandler, ...summaryPreviewHandler, ...getRole, ...editDeal, ...disablePromotion, ...voucherList];

export default allHandlers;
