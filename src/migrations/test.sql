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
  ,[status]
  ,[project]
  ,[user_id]
  )
VALUES
  (
    '86c7f7ba-e2fc-11eb-ba80-0242ac130004'
    , '256-лс'
    , '2.2021'
    , 1
    , 1
    , 1
  ),
  (
    '86c7f7ba-e2fc-11eb-ba80-0242ac130004'
    , '1012-КТ'
    , '12.2020'
    , 1
    , 1
    , 3
  )
GO

INSERT INTO [dbo].[document_status]
  (
  [uuid]
  ,[name]
  ,[type]
  )
VALUES
  (
    '436360a8-e302-11eb-ba80-0242ac130004'
    , 'Согласование'
    , 'all'
  ),
  (
    '85231bd2-e302-11eb-ba80-0242ac130004'
    , 'На подписании'
    , 'all'
  )
GO

INSERT INTO [dbo].[notification]
  (
    [uuid]
  ,[text]
  ,[type]
  ,[status]
  ,[user_id]
  )
VALUES
(
  'c35db6f4-e30d-11eb-ba80-0242ac130004'
  , 'Тестовое уведомление системы'
  , 'system'
  , 0
  , 1
  ),
  (
  'fc0fbc78-e302-11eb-ba80-0242ac130004'
  , 'Вас назначили согласантом справки КС-3'
  , 'document'
  , 0
  , 1
  )
GO