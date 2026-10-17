// Requisites supplied by the studio owner, 16 October 2026.
export const operatorDetails = {
  legalName: "ИП Аветисян Артур Давидович",
  ogrnip: "323180000038342",
  inn: "183800043387",
  legalAddress: "191186, Россия, г. Санкт-Петербург, ул. Малая Морская, д. 11, офис 319-4",
  email: "Tattoo1office@gmail.com",
  phone: "+7 917 575 3161",
  bankName: "АО «ТБанк» (г. Москва)",
  bankBik: "044525974",
  bankCorrespondent: "30101810145250000974",
  bankAccount: "40802810600005342739",
  operatorDetailsVersion: "2026-10-16",
};
export function updateOperatorDetails(settings) {
  if (settings.operatorDetailsVersion === operatorDetails.operatorDetailsVersion) return settings;
  const next = {...settings, ...operatorDetails};
  const placeholders = [
    "Перед открытием регистрации владелец студии дополнит этот текст своими реквизитами, контактами и сведениями о технических подрядчиках.",
    "Этот текст описывает предполагаемый порядок работы. Перед включением оплаты владелец студии внесёт реквизиты, тарифы и окончательные условия возврата.",
    "До открытия регистрации владелец студии укажет полное наименование оператора, адрес, контакт и срок обработки данных.",
  ];
  for (const key of ['privacy','offer','consent']) {
    if (typeof next[key] === 'string') for (const text of placeholders) next[key] = next[key].replace(text, '').trim();
  }
  return next;
}
