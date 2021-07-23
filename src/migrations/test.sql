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

INSERT INTO [dbo].[ks3]
  (
  [uuid]
  ,[document_number]
  ,[reporting_period]
  ,[date_preparation]
  ,[status_id]
  ,[project]
  ,[user_id]
  )
VALUES
  (
    NEWID()
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
    , 1
    , 2
  )
GO

INSERT INTO [dbo].[document_status]
  (
  [uuid]
  ,[name_ru]
  ,[name_en]
  ,[type]
  )
VALUES
  (
    NEWID()
    , 'Согласование'
    ,'Approval'
    , 'all'
  ),
  (
    NEWID()
    , 'На подписании'
    ,'On signing'
    , 'all'
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

INSERT INTO [dbo].[ks3] (
      [uuid]
      ,[document_number]
      ,[reporting_period]
      ,[project]
      ,[user_id]
      ,[status_id]
) VALUES (
  NEWID()
  ,'223-лс'
  ,'1.2020'
  ,1
  ,1
  ,1
)
GO