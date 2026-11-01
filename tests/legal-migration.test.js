import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults } from '../server/domain.js';
import { updateLegalDocuments } from '../server/legal-migration.js';

test('unchanged legacy footer policy is upgraded and requires owner review', () => {
  const privacy = 'Tattoo Office обрабатывает имя, адрес электронной почты, сведения о записи и текст обращения, которые человек сам указывает на сайте. Пароль хранится в виде стойкого хеша.\n\nДанные нужны для создания личного кабинета мастера, организации сеанса и связи по связанным с ним вопросам. Доступ к ним получают уполномоченные сотрудники студии в объёме, необходимом для работы. Данные не продаются.\n\nПользователь может запросить доступ, исправление или удаление данных через контакт студии. Срок хранения зависит от цели обработки и требований законодательства.';
  const current = { ...defaults, privacy, legalApproved: true };
  const updated = updateLegalDocuments(current);
  assert.match(updated.privacy, /Технические cookie-файлы/);
  assert.equal(updated.legalApproved, false);
  assert.equal(updateLegalDocuments(updated), updated);
  const custom = { ...current, privacy: 'Утверждённая владельцем политика' };
  assert.equal(updateLegalDocuments(custom), custom);
});
