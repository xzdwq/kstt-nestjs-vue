USE [kstt]
GO

INSERT INTO [dbo].[project]
  (
    [name_ru]
    ,[name_en]
  )
VALUES
  (
    'АЭС Аккую'
    ,'Akkuyu NPP'
  )
GO

INSERT INTO [dbo].[default_workflow_stage]
  (
    [code]
    ,[name_ru]
    ,[short_name_ru]
    ,[name_en]
    ,[short_name_en]
    ,[previous_stage]
    ,[next_stage]
    ,[order_execution_stage]
	,[hierarchy]
  )
VALUES
  (
    'project'
    ,'Проект'
    ,'Проект'
    ,'Project'
    ,'Project'
    ,NULL
    ,2
    ,1
	,'1'
  ),
  (
    'ks2_approv'
    ,'Согласование КС-2'
    ,'Согл. КС-2'
    ,'Coordination of KS-2'
    ,'Coord. of KS-2'
    ,1
    ,3
    ,2
	,'2'
  ),
  (
    'ks2_sign'
    ,'Подписание КС-2'
    ,'Подп. КС-2'
    ,'Signing of KS-2'
    ,'Sign. of KS-2'
    ,2
    ,4
    ,3
	,'3'
  ),
  (
    'ks2_complited'
    ,'Приемка КС-2 завершена'
    ,'Приемка КС-2 зав.'
    ,'Acceptance of KS-2 completed'
    ,'Accept. of KS-2 compl.'
    ,3
    ,5
    ,4
	,'4'
  ),
  (
    'ks3_check'
    ,'Проверка КС-3'
    ,'Пров. КС-3'
    ,'Checking KS-3'
    ,'Check. KS-3'
    ,4
    ,6
    ,5
	,'5'
  ),
  (
    'ks3_sign'
    ,'Подписание КС-3'
    ,'Подп. КС-3'
    ,'Signing of KS-3'
    ,'Sign. of KS-3'
    ,5
    ,7
    ,6
	,'6'
  ),
  (
    'ks3_complited'
    ,'Подписан'
    ,'Подписан'
    ,'Signed'
    ,'Signed'
    ,6
    ,NULL
    ,7
	,'7'
  )
GO

INSERT INTO [dbo].[group_type]
  (
    [name_ru]
    ,[name_en]
  )
VALUES
  (
    'Параллельно'
    ,'Parallel'
  ),
  (
    'Последовательно'
    ,'Consistently'
  ),
  (
    'Экстра'
    ,'Extra'
  )
GO

INSERT INTO [dbo].[side]
  (
    [code]
    ,[name_ru]
    ,[name_en]
  )
VALUES
  (
    'performer'
    ,'Исполнитель'
    ,'Performer'
  ),
  (
    'customer'
    ,'Заказчик'
    ,'Customer'
  )
GO

INSERT INTO [dbo].[signature_type]
  (
    [uuid]
    ,[name_ru]
    ,[name_en]
    ,[type]
  )
VALUES
(
  NEWID()
  ,'Простая ЭП'
  ,'Simple ES'
  ,-1
),
(
  NEWID()
  ,'CAdES-BES'
  ,'CAdES-BES'
  ,1
),
(
  NEWID()
  ,'CAdES-T'
  ,'CAdES-T'
  ,5
),
(
  NEWID()
  ,'CAdES-X Long Type'
  ,'CAdES-X Long Type'
  ,93
)
GO

INSERT INTO [dbo].[file_type]
(
  [code]
  ,[name_ru]
  ,[name_en]
  ,[description_ru]
  ,[description_en]
)
VALUES
(
  'excel-certificate-ks3'
  ,'Форма КС-3'
  ,'Form KS-3'
  ,'Excel форма справки КС-3'
  ,'Excel form of certificate KS-3'
),
(
  'pdf-addendum-ks3'
  ,'Форма КС-3'
  ,'Form KS-3'
  ,'PDF приложение к справки КС-3'
  ,'PDF addendum to certificate KS-3'
),
(
  'excel-act-ks2'
  ,'Форма КС-2'
  ,'Form KS-2'
  ,'Excel форма акта КС-2'
  ,'Excel form of act KS-2'
),
(
  'pdf-act-ks2'
  ,'Форма КС-2'
  ,'Form KS-2'
  ,'PDF форма акта КС-2'
  ,'PDF form of act KS-2'
),
(
  'pdf-ks6a'
  ,'Форма КС-6а'
  ,'Form KS-6a'
  ,'PDF форма КС-6а'
  ,'PDF form KS-6a'
),
(
  'other-ks2'
  ,'Прочие файлы'
  ,'Other files'
  ,'Прочие файлы (КС-2)'
  ,'Other files (KS-2)'
),
(
  'other-ks3'
  ,'Прочие файлы'
  ,'Other files'
  ,'Прочие файлы (КС-3)'
  ,'Other files (KS-3)'
)
GO

INSERT INTO [dbo].[ks2_status]
(
	[code]
	,[name_ru]
	,[name_en]
)
VALUES
(
  'annuled'
  ,'Аннулирован'
  ,'Annulled'
),
(
  'signing'
  ,'На подписании'
  ,'On signing'
),
(
  'approval'
  ,'На согласовании'
  ,'On approval'
),
(
  'signed'
  ,'Подписан'
  ,'Signed by'
),
(
  'project'
  ,'Проект'
  ,'Project'
),
(
  'agreed'
  ,'Согласован'
  ,'Agreed'
),
(
  'fixing'
  ,'Устранение замечаний'
  ,'Fixing problems'
)
GO

INSERT INTO [dbo].[role]
(
  [code]
  ,[name_ru]
  ,[name_en]
  ,[comment]
)
VALUES
(
  'guest'
  ,'Гость'
  ,'Guest'
  ,'Первичная роль, которая выдается по умолчанию любому впервые прошедшему авторизацию на портале.'
),
(
  'reader'
  ,'Читатель'
  ,'Reader'
  ,'Просмотр информации. Не может инициализировать действия.'
),
(
  'negotiator_ks2'
  ,'Согласующий КС-2'
  ,'Negotiator KS-2'
  ,'Участвует в согласовании актов КС-2'
),
(
  'negotiator_ks3'
  ,'Согласующий КС-3'
  ,'Negotiator KS-3'
  ,'Участвует в согласовании справки КС-3'
),
(
  'editor'
  ,'Редактор'
  ,'Editor'
  ,'Редактирование и сохранение информации. Настройка маршрутов и запуск согласования.'
),
(
  'manager'
  ,'Менеджер'
  ,'Manager'
  ,'Удаление карточек, отмена согласования.'
),
(
  'admin'
  ,'Администратор'
  ,'Administrator'
  ,'Администратор портала'
)
GO

---------------------------------------------
---------------------------------------------
---------------------------------------------
---------------------------------------------
---------------------------------------------
---------------------------------------------
---------------------------------------------
---------------------------------------------
---------------------------------------------
---------------------------------------------
---------------------------------------------
---------------------------------------------
---------------------------------------------
---------------------------------------------
---------------------------------------------
---------------------------------------------


INSERT INTO [dbo].[user]
  (
  [uuid]
  ,[full_name]
  ,[email]
  ,[department]
  ,[position]
  ,[role]
  )
VALUES
  (
    NEWID(),
    'Иванов Иван Иванович',
    'i.ivanov@mail.ru',
    'Отдел управления',
    'Инженер',
    1
  ),
  (
    NEWID(),
    'Петоров Петр Петрович',
    'p.petrov@mail.ru',
    'Отдел управления',
    'Ведущий инженер',
    2
  ),
  (
    NEWID(),
    'Пушкин Александр Сергеевич',
    'a.pushkin@mail.ru',
    'Отдел управления',
    'Ведущий инженер',
    1
  ),
  (
    NEWID(),
    'Гоголь Николай Васильевич',
    'n.gogol@mail.ru',
    'Отдел управления',
    'Ведущий инженер',
    1
  )
GO

INSERT INTO [dbo].[notification]
  (
    [uuid]
  ,[text_ru]
  ,[text_en]
  ,[type]
  ,[status]
  ,[user_id]
  )
VALUES
(
  NEWID()
  , 'Тестовое уведомление системы'
  ,'System test notification'
  , 'system'
  , 0
  , 1
  ),
  (
  NEWID()
  , 'Вас назначили согласантом справки КС-3'
  ,'You were appointed as a co-ordinator of the KS-3 certificate'
  , 'document'
  , 0
  , 1
  )
GO

INSERT INTO [dbo].[group]
  (
    [code]
    ,[name_ru]
    ,[name_en]
    ,[type_id]
  )
VALUES
  (
    'AKKU_KS_CONTROL'
    ,'Группа контроля'
    ,'Control group'
    ,2
  ),
  (
    'AKKU_KS_SIGNER'
    ,'Группа подписания (КС-2/КС-3)'
    ,'Signing group (KS-2/KS-3)'
    ,1
  ),
  (
    'AKKU_KS2_SIGNER'
    ,'Группа подписания актов КС-2'
    ,'Group of signing acts KS-2'
    ,1
  ),
  (
    'AKKU_KS3_SIGNER'
    ,'Группа подписания справок КС-3'
    ,'Certificate signing group KS-3'
    ,2
  )
GO

INSERT INTO [dbo].[user_group]
  (
    [user_id]
    ,[group_id]
  )
VALUES
  (
    1
    ,1
  ),
  (
    2
    ,2
  ),
  (
    4
    ,2
  ),
  (
    1
    ,3
  ),
  (
    2
    ,3
  ),
  (
    3
    ,3
  ),
  (
    1
    ,4
  ),
  (
    4
    ,4
  )
GO

INSERT INTO [dbo].[default_workflow_stage_group]
  (
    [stage_id]
    ,[group_id]
    ,[order_execution_group]
    ,[hierarchy]
  )
VALUES
  (
    1
	,1
  ,1
  ,'1.1'
  ),
  (
    2
	,1
  ,2
  ,'2.1'
  ),
  (
    2
	,2
  ,3
  ,'2.2'
  ),
  (
    2
	,3
  ,3
  ,'2.2'
  ),
  (
    3
	,1
  ,4
  ,'3.1'
  ),
  (
    4
	,1
  ,5
  ,'4.1'
  ),
  (
    4
	,2
  ,6
  ,'4.2'
  ),
  (
    5
	,1
  ,7
  ,'5.1'
  ),
  (
    5
	,4
  ,8
  ,'5.2'
  ),
  (
    6
	,1
  ,9
  ,'6.1'
  )
GO

INSERT INTO [dbo].[default_workflow_stage_group_user]
  (
	[stage_id]
	,[group_id]
	,[user_id]
	,[order_execution_user]
	,[hierarchy]
  )
VALUES
  -- в стадии 1 есть 1 группа с 1 человеком
  (
   1
   ,1 -- последовательная (id из default_workflow_stage_group) 
   ,1
   ,1
   ,'1.1.1'
  ),
  -- в стадии 2 есть 3 группы с 6 людьми
  (
   2
   ,2 --последовательная
   ,1
   ,2
   ,'2.1'
  ),
  (
   2
   ,3 -- параллельная
   ,2
   ,3
   ,'2.2'
  ),
  (
   2
   ,3 --параллельная
   ,4
   ,3
   ,'2.2'
  ),
  (
   2
   ,4 --параллельная
   ,1
   ,4
   ,'2.3'
  ),
  (
   2
   ,4 --параллельная
   ,2
   ,4
   ,'2.3'
  ),
  (
   2
   ,4 --параллельная
   ,3
   ,4
   ,'2.3'
  ),
  -- в стадии 3 есть 1 группа с 1 человеком
  (
   3
   ,5 --последовательная
   ,1
   ,5
   ,'3.1'
  ),
  -- в стадии 4 2 группы с 3 людьми
  (
   4
   ,6 --последовательная
   ,1
   ,6
   ,'4.1'
  ),
  (
   4
   ,7 --параллельная
   ,2
   ,7
   ,'4.2'
  ),
  (
   4
   ,7 --параллельная
   ,4
   ,7
   ,'4.2'
  ),
  -- в стадии 5 2 группы с 3 людьми
  (
   5
   ,8 --последовательная
   ,1
   ,8
   ,'5.1'
  ),
  (
   5
   ,9 --последовательная
   ,1
   ,9
   ,'5.2'
  ),
  (
   5
   ,9 --последовательная
   ,4
   ,10
   ,'5.3'
  ),
  -- в стадии 6 1 группа с 1 человеком
  (
   6
   ,10 --последовательная
   ,1
   ,11
   ,'6.1'
  )
GO


INSERT INTO [dbo].[ks2_total_sum_type]
(
	[code]
	,[name_ru]
	,[name_en]
)
VALUES
(
  'total_direct_costs'
  ,'Итого прямые затраты (ПЗ) по акту в текущих ценах'
  ,'Total direct costs (DC) on Certificate in current prices'
),
(
  'construction_works'
  ,'Строительные работы'
  ,'Construction works'
),
(
  'installation_works'
  ,'Монтажные работы'
  ,'Installation works'
),
(
  'equipment'
  ,'Оборудование'
  ,'Equipment'
),
(
  'other_works_costs'
  ,'Прочие работы и затраты'
  ,'Other works and costs'
),
(
  'overheads_profit'
  ,'Накладные расходы и прибыль (25% от ПЗ)'
  ,'Overheads and profit (25 % from DC)'
),
(
  'total_act_OEP'
  ,'Итого по акту с учетом НР и СП'
  ,'Total on certificate considering Overheads and Estimated Profit'
),
(
  'contractor_risk'
  ,'Оплата непредвиденных расходов и затрат, связанных с реализацией рисков Подрядчика'
  ,'Contractor Risk Fee'
),
(
  'total_act'
  ,'Итого по акту'
  ,'Total on certificate'
),
(
  'act_total_reduction_coefficient'
  ,'Итого по акту с учетом понижающего коэффициента 0,9318'
  ,'Certificate total with reduction coefficient 0,9318'
),
(
  'vat_turkish'
  ,'НДС 18% в соответствии с законодательством Турецкой Республики'
  ,'VAT 18 % in accordance with the Law of Turkish Republic'
),
(
  'total_certificate_paid'
  ,'Итого по акту к оплате с учетом НДС 18%'
  ,'Total on Certificate to be paid considering VAT 18 %'
)
GO

-- DBCC CHECKIDENT ([default_workflow_stage_group_user], RESEED, 1)