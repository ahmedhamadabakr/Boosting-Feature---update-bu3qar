//import bcrypt from "bcryptjs";
//hWFfEkzkYE1X691J4qmcuZHAoet7Ds7ADhL

//( white label test mode token )-------------->const token = "e66a94d579cf75fba327ff716ad68c53aae11528";

//jtest123
//fd8617211862edfe75a11d25f2de229efa380996

const token = "fd8617211862edfe75a11d25f2de229efa380996";
// const api = bcrypt.hashSync(
//   "fd8617211862edfe75a11d25f2de229efa380996",
//   bcrypt.genSaltSync()
// );
const object2 = {
  merchant_id: process.env.NEXT_PUBLIC_UPAYMENTS_MERCHANT_ID,
  username: process.env.NEXT_PUBLIC_UPAYMENTS_USERNAME,
  password: process.env.NEXT_PUBLIC_UPAYMENTS_PASSWORD,
  //jtest123
  //"$2y$10$hV8nKZWqclPQf1V39bLC8.GGQtXg4MeCJW1vfcaF1IRpeZOvCiHey",
  api_key: "$2y$10$hV8nKZWqclPQf1V39bLC8.GGQtXg4MeCJW1vfcaF1IRpeZOvCiHey",
  // 1  //0
  test_mode: 0,
  CurrencyCode: "KWD",
};
//https://api.upayments.com/payment-request
//https://api.upayments.com/test-payment

//https://uapi.upayments.com/api/v1/charge
//https://sandboxapi.upayments.com/api/v1/charge

const Execute = async (req, res) => {
  try {
    
    const paymentData = { 
      ...JSON.parse(req.body), 
      ...object2 
    };
    

    const response = await fetch("https://uapi.upayments.com/api/v1/charge", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: responseData?.message || "Payment API Error",
        result: responseData
      });
    }

      // العودة بنفس الـ response structure
    res.status(200).json({
      result: responseData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      result: null
    });
  }
};
export default Execute;
