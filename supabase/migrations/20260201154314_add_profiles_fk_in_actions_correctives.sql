-- delete the existing 'responsable' column and add a new foreign key column 'id_responsable' referencing 'profiles' table
ALTER TABLE actions_correctives DROP COLUMN responsable;

ALTER TABLE actions_correctives
    ADD COLUMN id_responsable UUID REFERENCES profiles (id);
