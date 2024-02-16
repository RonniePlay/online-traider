import CusotmInput from "../../../components/input";
import { SmBlueButton } from "../../../components/buttons";
import styles from "./my.module.scss";
import axios from "axios";
import DataCreate from "../../../utils/data-create";
import LocalStorage from "../../../services/localStorage";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorContext } from "../../../components/error-modal";
import convertMoney from "../../../utils/convertMoney";

const MyPayments = () => {
  const [payment, setPayment] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { i18n, t } = useTranslation();
  const { setError, setMessage } = useContext(ErrorContext);

  useEffect(() => {
    const { key, rand_param } = DataCreate();

    axios
      .get("https://cabinet.itcyclonelp.com/api/v_2/payments/GetUsersClaims", {
        params: {
          key,
          rand_param,
          auth_token: LocalStorage.get("auth_token"),
          user_id: LocalStorage.get("user_id"),
          languages: i18n.language,
        },
      })
      .then((e) => {
        if (e.data.result === "success") {
          setPayment(Object.values(e.data.values));
          setError(false);
          setFilteredData(Object.values(e.data.values));
        } else {
          setError(true);
          setMessage(t("profile.error"));
        }
      });
  }, []);

  const handleClick = () => {
    const filtered = payment.filter((item) => {
      const startDateMatch = startDate
        ? new Date(item.creation_date * 1000) >= new Date(startDate)
        : true;
      const endDateMatch = endDate
        ? new Date(item.creation_date * 1000) <= new Date(endDate)
        : true;

      return startDateMatch && endDateMatch;
    });

    setFilteredData(filtered);
  };

  return (
    <>
      <h1>{t("my_payment.h1")}</h1>
      <div className={styles.my_payments}>
        <div>
          <fieldset className="fs-t">
            <div>{t("my_payment.start")}</div>
            <CusotmInput
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </fieldset>
          <fieldset className="fs-t">
            <div>{t("my_payment.end")}</div>
            <CusotmInput
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </fieldset>
          <SmBlueButton className={styles.btn} onClick={handleClick}>
            {t("my_payment.btn")}
          </SmBlueButton>
        </div>
        <div className={styles.adaptive}>
          <table>
            <thead>
              <tr>
                <th>{t("my_payment.th.num")}</th>
                <th>{t("my_payment.th.acc")}</th>
                <th>{t("my_payment.th.acc_type")}</th>
                <th>{t("my_payment.th.date")}</th>
                <th>{t("my_payment.th.payment")}</th>
                <th>{t("my_payment.th.trans")}</th>
                <th>{t("my_payment.th.sum")}</th>
                <th>{t("my_payment.th.status")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((item) => (
                <tr key={item.account_id}>
                  <td data-label={t("my_payment.th.num")}>{item.account_id}</td>
                  <td data-label={t("my_payment.th.acc")}>
                    {item.server_account}
                  </td>
                  <td data-label={t("my_payment.th.acc_type")}>
                    {item.account_type}
                  </td>
                  <td data-label={t("my_payment.th.date")}>
                    {new Date(item.creation_date * 1000).toLocaleDateString()}
                  </td>
                  <td data-label={t("my_payment.th.payment")}>
                    {item.payment_system}
                  </td>
                  <td data-label={t("my_payment.th.trans")}>
                    {item.payment_type}
                  </td>
                  <td data-label={t("my_payment.th.sum")}>
                    {convertMoney(item.account_value)} {item.account_currency}
                  </td>
                  <td data-label={t("my_payment.th.status")}>{item.status}</td>
                </tr>
              ))}
            </tbody>
            {filteredData.length === 0 && (
              <tfoot>
                <tr>
                  <td colSpan={10}>{t("tfoot")}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default MyPayments;
