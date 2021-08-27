USE [kstt]
GO

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

INSERT INTO [dbo].[default_workflow_stage]
  (
    [name_ru]
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
    'Проект'
    ,'Проект'
    ,'Project'
    ,'Project'
    ,NULL
    ,2
    ,1
	,'1'
  ),
  (
    'Согласование и подписание КС-2'
    ,'Согл. и подп. КС-2'
    ,'Coordination and signing of KS-2'
    ,'Coord. and sign. of KS-2'
    ,1
    ,3
    ,2
	,'2'
  ),
  (
    'Приемка КС-2 завершена'
    ,'Приемка КС-2 зав.'
    ,'Acceptance of KS-2 completed'
    ,'Accept. of KS-2 compl.'
    ,2
    ,4
    ,3
	,'3'
  ),
  (
    'Проверка КС-3'
    ,'Пров. КС-3'
    ,'Checking KS-3'
    ,'Check. KS-3'
    ,3
    ,5
    ,4
	,'4'
  ),
  (
    'Подписание КС-3'
    ,'Подп. КС-3'
    ,'Signing of KS-3'
    ,'Sign. of KS-3'
    ,4
    ,6
    ,5
	,'5'
  ),
  (
    'Подписан'
    ,'Подписан'
    ,'Signed'
    ,'Signed'
    ,5
    ,NULL
    ,6
	,'6'
  )
GO

INSERT INTO [dbo].[project]
  (
    [name_ru]
    ,[name_en]
  )
VALUES
  (
    'АЭС проект'
    ,'Nuclear NPP'
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
  )

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

-- DBCC CHECKIDENT ([default_workflow_stage_group_user], RESEED, 1)