import { useCallback, useState } from "react";
import * as Print from "expo-print";
import { Order } from "@/models/order";

interface UsePrintReturn {
	isPrinting: boolean;
	error: string | null;
	printInvoice: (order: Order) => Promise<void>;
}

const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(amount);
};

const generateInvoiceHtml = (order: Order): string => {
	const itemsHtml = order.items
		.map(
			(item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">
          <strong>${item.productName}</strong><br/>
          <small>Size: ${item.sizeName}</small>
          ${
						item.toppings.length > 0
							? `<br/><small>Toppings: ${item.toppings.map((t) => t.toppingName).join(", ")}</small>`
							: ""
					}
          ${item.note ? `<br/><small>Note: ${item.note}</small>` : ""}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.unitPrice)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.subtotal)}</td>
      </tr>
    `,
		)
		.join("");

	return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 400px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .order-info {
          margin-bottom: 20px;
          padding: 10px;
          background: #f9f9f9;
          border-radius: 4px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          padding: 10px 8px;
          text-align: left;
          border-bottom: 2px solid #333;
          font-size: 12px;
        }
        .summary {
          margin-top: 20px;
          border-top: 2px solid #333;
          padding-top: 10px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }
        .summary-row.total {
          font-size: 18px;
          font-weight: bold;
          border-top: 1px solid #333;
          padding-top: 10px;
          margin-top: 10px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>HÓA ĐƠN</h1>
        <p>Order #${order.orderNumber}</p>
        <p>${new Date(order.createdAt).toLocaleString("vi-VN")}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th style="text-align: center;">SL</th>
            <th style="text-align: right;">Đơn giá</th>
            <th style="text-align: right;">T.Tiền</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="summary">
        <div class="summary-row">
          <span>Tạm tính:</span>
          <span>${formatCurrency(order.subtotal)}</span>
        </div>
        ${
					order.includeVat
						? `
          <div class="summary-row">
            <span>VAT (${order.vatRate * 100}%):</span>
            <span>${formatCurrency(order.vatAmount)}</span>
          </div>
        `
						: ""
				}
        ${
					order.discountAmount > 0
						? `
          <div class="summary-row">
            <span>Giảm giá${order.voucherCode ? ` (${order.voucherCode})` : ""}:</span>
            <span>-${formatCurrency(order.discountAmount)}</span>
          </div>
        `
						: ""
				}
        <div class="summary-row total">
          <span>TỔNG CỘNG:</span>
          <span>${formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      ${order.note ? `<p style="margin-top: 20px;"><strong>Ghi chú:</strong> ${order.note}</p>` : ""}

      <div class="footer">
        <p>Cảm ơn quý khách!</p>
        <p>Hẹn gặp lại!</p>
      </div>
    </body>
    </html>
  `;
};

export const usePrint = (): UsePrintReturn => {
	const [isPrinting, setIsPrinting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const printInvoice = useCallback(async (order: Order) => {
		try {
			setIsPrinting(true);
			setError(null);

			const html = generateInvoiceHtml(order);
			await Print.printAsync({ html });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to print");
		} finally {
			setIsPrinting(false);
		}
	}, []);

	return {
		isPrinting,
		error,
		printInvoice,
	};
};

export default usePrint;
