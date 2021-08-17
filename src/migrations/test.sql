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

INSERT INTO [dbo].[ks3_stage_workflow]
  (
    [name_ru]
    ,[short_name_ru]
    ,[name_en]
    ,[short_name_en]
    ,[previous_stage]
    ,[next_stage]
    ,[order_execution_stage]
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
  ),
  (
    'Согласование и подписание КС-2'
    ,'Согл. и подп. КС-2'
    ,'Coordination and signing of KS-2'
    ,'Coord. and sign. of KS-2'
    ,1
    ,3
    ,2
  ),
  (
    'Приемка КС-2 завершена'
    ,'Приемка КС-2 зав.'
    ,'Acceptance of KS-2 completed'
    ,'Accept. of KS-2 compl.'
    ,2
    ,4
    ,3
  ),
  (
    'Проверка КС-3'
    ,'Пров. КС-3'
    ,'Checking KS-3'
    ,'Check. KS-3'
    ,3
    ,5
    ,4
  ),
  (
    'Подписание КС-3'
    ,'Подп. КС-3'
    ,'Signing of KS-3'
    ,'Sign. of KS-3'
    ,4
    ,6
    ,5
  ),
  (
    'Подписан'
    ,'Подписан'
    ,'Signed'
    ,'Signed'
    ,5
    ,NULL
    ,6
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
    3
    ,3
  ),
  (
    4
    ,4
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
    1
    ,4
  ),
  (
    4
    ,2
  )
GO

INSERT INTO [dbo].[ks3_stage_workflow_group]
  (
    [ks3_stage_workflow_id]
    ,[group_id]
  )
VALUES
  (
    1
	,1
  ),
  (
    2
	,1
  ),
  (
    3
	,1
  ),
  (
    4
	,1
  ),
  (
    5
	,1
  ),
  (
    6
	,1
  ),
  (
    2
	,2
  ),
  (
    2
	,3
  ),
  (
    4
	,2
  ),
  (
    5
	,4
  )
GO

INSERT INTO [dbo].[workflow]
  (
    [current_stage]
    ,[last_action_ru]
    ,[last_action_en]
    ,[deadline]
    ,[started]
    ,[complete]
  )
VALUES
  (
    1
	,'Рабочий процесс 1 создан'
	,'Workflow 1 created'
	,GETDATE()
	,0
	,0
  ),
  (
    1
	,'Рабочий процесс 2 создан'
	,'Workflow 2 created'
	,GETDATE()
	,0
	,0
  )
GO

INSERT INTO [dbo].[workflow_stage]
  (
    [name_ru]
    ,[short_name_ru]
    ,[name_en]
    ,[short_name_en]
    ,[previous_stage]
    ,[next_stage]
    ,[order_execution_stage]
    ,[action]
    ,[complete]
	,[workflow_id]
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
    ,1
    ,0
	,1
  ),
  (
    'Согласование и подписание КС-2'
    ,'Согл. и подп. КС-2'
    ,'Coordination and signing of KS-2'
    ,'Coord. and sign. of KS-2'
    ,1
    ,3
    ,2
    ,0
    ,0
	,1
  ),
  (
    'Приемка КС-2 завершена'
    ,'Приемка КС-2 зав.'
    ,'Acceptance of KS-2 completed'
    ,'Accept. of KS-2 compl.'
    ,2
    ,4
    ,3
    ,0
    ,0
	,1
  ),
  (
    'Проверка КС-3'
    ,'Пров. КС-3'
    ,'Checking KS-3'
    ,'Check. KS-3'
    ,3
    ,5
    ,4
    ,0
    ,0
	,1
  ),
  (
    'Подписание КС-3'
    ,'Подп. КС-3'
    ,'Signing of KS-3'
    ,'Sign. of KS-3'
    ,4
    ,6
    ,5
    ,0
    ,0
	,1
  ),
  (
    'Подписан'
    ,'Подписан'
    ,'Signed'
    ,'Signed'
    ,5
    ,NULL
    ,6
    ,0
    ,0
	,1
  ),
  (
    'Проект 2'
    ,'Проект 2'
    ,'Project 2'
    ,'Project 2'
    ,NULL
    ,2
    ,1
    ,1
    ,0
	,2
  ),
  (
    'Согласование и подписание КС-2'
    ,'Согл. и подп. КС-2'
    ,'Coordination and signing of KS-2'
    ,'Coord. and sign. of KS-2'
    ,1
    ,3
    ,2
    ,0
    ,0
	,2
  ),
  (
    'Приемка КС-2 завершена'
    ,'Приемка КС-2 зав.'
    ,'Acceptance of KS-2 completed'
    ,'Accept. of KS-2 compl.'
    ,2
    ,4
    ,3
    ,0
    ,0
	,2
  ),
  (
    'Проверка КС-3'
    ,'Пров. КС-3'
    ,'Checking KS-3'
    ,'Check. KS-3'
    ,3
    ,5
    ,4
    ,0
    ,0
	,2
  ),
  (
    'Подписание КС-3'
    ,'Подп. КС-3'
    ,'Signing of KS-3'
    ,'Sign. of KS-3'
    ,4
    ,6
    ,5
    ,0
    ,0
	,2
  ),
  (
    'Подписан'
    ,'Подписан'
    ,'Signed'
    ,'Signed'
    ,5
    ,NULL
    ,6
    ,0
    ,0
	,2
  )
GO

INSERT INTO [dbo].[workflow_stage_group]
  (
    [code]
    ,[name_ru]
    ,[name_en]
    ,[type_id]
    ,[action]
    ,[complete]
	,[stage_id]
  )
VALUES
-- 1 wf
  (
    'AKKU_KS_CONTROL'
    ,'Группа контроля'
    ,'Control group'
    ,2
    ,0
    ,0
	,1
  ),
  (
    'AKKU_KS_CONTROL'
    ,'Группа контроля'
    ,'Control group'
    ,2
    ,0
    ,0
	,2
  ),
  (
    'AKKU_KS_CONTROL'
    ,'Группа контроля'
    ,'Control group'
    ,2
    ,0
    ,0
	,3
  ),
  (
    'AKKU_KS_CONTROL'
    ,'Группа контроля'
    ,'Control group'
    ,2
    ,0
    ,0
	,4
  ),
  (
    'AKKU_KS_CONTROL'
    ,'Группа контроля'
    ,'Control group'
    ,2
    ,0
    ,0
	,5
  ),
  (
    'AKKU_KS_CONTROL'
    ,'Группа контроля'
    ,'Control group'
    ,2
    ,0
    ,0
	,6
  ),
  (
    'AKKU_KS_SIGNER'
    ,'Группа подписания (КС-2/КС-3)'
    ,'Signing group (KS-2/KS-3)'
    ,1
    ,0
    ,0
	,2
  ),
  (
    'AKKU_KS_SIGNER'
    ,'Группа подписания (КС-2/КС-3)'
    ,'Signing group (KS-2/KS-3)'
    ,1
    ,0
    ,0
	,3
  ),
  (
    'AKKU_KS2_SIGNER'
    ,'Группа подписания актов КС-2'
    ,'Group of signing acts KS-2'
    ,1
    ,0
    ,0
	,2
  ),
  (
    'AKKU_KS3_SIGNER'
    ,'Группа подписания справок КС-3'
    ,'Certificate signing group KS-3'
    ,2
    ,0
    ,0
	,5
  ),
-- 2 wf
  (
    'AKKU_KS_CONTROL 2'
    ,'Группа контроля 2'
    ,'Control group'
    ,2
    ,0
    ,0
	,7
  ),
  (
    'AKKU_KS_CONTROL 2'
    ,'Группа контроля 2'
    ,'Control group'
    ,2
    ,0
    ,0
	,8
  )
GO

INSERT INTO [dbo].[workflow_stage_group_user]
  (
    [workflow_stage_group_id]
  )
  VALUES
  (
    1
  ),
  (
    1
  ),
  (
    2
  ),
  (
    3
  ),
  (
    4
  ),
  (
    5
  ),
  (
    6
  ),
  (
    7
  ),
  (
    8
  ),
  (
    9
  ),
  (
    10
  ),
  (
    11
  ),
  (
    12
  )
GO

INSERT INTO [dbo].[ks3]
  (
  [uuid]
  ,[certificate_number]
  ,[document_number]
  ,[reporting_period]
  ,[date_preparation]
  ,[project_id]
  ,[user_id]
  ,[workflow_id]
  )
VALUES
  (
    NEWID()
    ,'001-a'
    , '256-лс'
    , GETDATE()
	, GETDATE()
    , 1
    , 1
    , 1
  ),
  (
    NEWID()
    , '002-a'
    , '1012-КТ'
    , GETDATE()
	  , GETDATE()
    , 1
    , 1
    , 2
  )
GO