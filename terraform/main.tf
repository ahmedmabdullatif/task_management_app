# 1. تحديد مزود الخدمة (AWS)
provider "aws" {
  region = "us-east-1" # يمكنك تغييرها حسب المنطقة الأقرب لك
}

# 2. البحث التلقائي عن أحدث نسخة Ubuntu 22.04
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (الشركة المطورة لأوبونتو)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# 3. إنشاء مجموعة الأمان (Security Group)
resource "aws_security_group" "task_sg" {
  name        = "task_app_sg"
  description = "Allow SSH, HTTP (Frontend), and Backend API"

  # فتح منفذ SSH للتحكم في السيرفر
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # فتح منفذ 80 للواجهة الأمامية (Nginx)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # فتح منفذ 5001 للخلفية (Backend API)
  ingress {
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # السماح للسيرفر بالاتصال بالإنترنت الخارجي (لتنزيل التحديثات)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. إنشاء الخادم (EC2 Instance)
resource "aws_instance" "task_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.micro"     # مجاني ضمن الـ Free Tier
  key_name               = "task-app-key" # اسم المفتاح الذي أنشأته في AWS
  vpc_security_group_ids = [aws_security_group.task_sg.id]

  # سكريبت يعمل لمرة واحدة فور تشغيل السيرفر لتجهيز بيئة العمل
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

# 5. طباعة عنوان الـ IP الخارجي بعد الانتهاء
output "server_public_ip" {
  value       = aws_instance.task_server.public_ip
  description = "The public IP address of the web server"
}
