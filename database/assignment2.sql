--5.1
INSERT INTO public.account 
	(account_firstname, account_lastname, account_email, account_password)
VALUES
	('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--5.2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

--5.3
DELETE FROM public.account
WHERE account_id = 1;

--5.4
UPDATE public.inventory
SET inv_description = replace(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

--5.5
SELECT a.inv_make, a.inv_model, b.classification_name
FROM public.inventory a INNER JOIN public.classification b ON b.classification_id = a.classification_id
WHERE b.classification_name = 'Sport';

--5.6
UPDATE public.inventory
SET inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/');

