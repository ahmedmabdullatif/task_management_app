# 1. Define AWS Provider
provider "aws" {
  region = "us-east-1" # You can change this to your preferred region
}

# 2. Automatically find the latest Ubuntu 22.04 AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (Ubuntu developer)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# 3. Create Security Group
resource "aws_security_group" "task_sg" {
  name        = "task_app_sg"
  description = "Allow SSH, HTTP (Frontend), and Backend API"

  # Open SSH port to access the server
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Open actual Frontend port
  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Open port 5001 for Backend API
  ingress {
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow the server to connect to external internet (to download updates)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Create an EC2 Instance
resource "aws_instance" "task_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"     # Free tier eligible
  key_name               = "task-app-key" # Name of your AWS key pair
  vpc_security_group_ids = [aws_security_group.task_sg.id]

  # Script runs once upon instance start to prepare the environment
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y docker.io docker-compose git
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "TaskApp-Production-Server"
  }
}

# 5. Output the public IP address after creation
output "server_public_ip" {
  value       = aws_instance.task_server.public_ip
  description = "The public IP address of the web server"
}
