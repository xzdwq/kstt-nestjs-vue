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
    '123e4567-e89b-12d3-a456-426614174000',
    'Иванов Иван Иванович',
    'i.ivanov@mail.ru',
    'Отдел управления',
    'Инженер',
    1
  ),
  (
    '125d34a8-e2fc-11eb-ba80-0242ac130004',
    'Петоров Петр Петрович',
    'p.petrov@mail.ru',
    'Отдел управления',
    'Ведущий инженер',
    2
  )
GO

INSERT INTO [dbo].[ks3-stage-workflow]
  (
    [name_ru]
    ,[short_name_ru]
    ,[name_en]
    ,[short_name_en]
    ,[previous_stage]
    ,[next_stage]
  )
VALUES
  (
    'Проект'
    ,'Проект'
    ,'Project'
    ,'Project'
    ,NULL
    ,2
  ),
  (
    'Согласование и подписание КС-2'
    ,'Согл. и подп. КС-2'
    ,'Coordination and signing of KS-2'
    ,'Coord. and sign. of KS-2'
    ,1
    ,3
  ),
  (
    'Приемка КС-2 завершена'
    ,'Приемка КС-2 зав.'
    ,'Acceptance of KS-2 completed'
    ,'Accept. of KS-2 compl.'
    ,2
    ,4
  ),
  (
    'Проверка КС-3'
    ,'Пров. КС-3'
    ,'Checking KS-3'
    ,'Check. KS-3'
    ,3
    ,5
  ),
  (
    'Подписание КС-3'
    ,'Подп. КС-3'
    ,'Signing of KS-3'
    ,'Sign. of KS-3'
    ,4
    ,6
  ),
  (
    'Подписан'
    ,'Подписан'
    ,'Signed'
    ,'Signed'
    ,5
    ,NULL
  )

INSERT INTO [dbo].[ks3]
  (
  [uuid]
  ,[certificate_number]
  ,[document_number]
  ,[reporting_period]
  ,[date_preparation]
  ,[project]
  ,[user_id]
  ,[ks3_stage_workflow_id]
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
    , '1012-КТ'
    , GETDATE()
	, GETDATE()
    , 1
    , 2
    , 1
    , 1
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

INSERT INTO [dbo].[signature-type]
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