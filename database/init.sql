-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false
);

-- Insert mock records
INSERT INTO tasks (title, completed) VALUES
    ('Set up CI/CD pipeline', false),
    ('Write Dockerfile for backend', false),
    ('Configure Terraform for AWS', true);
