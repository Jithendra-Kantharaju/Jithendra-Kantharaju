# Jithendra Kantharaju

**DevOps & Cloud Engineer · Applied AI · Forward Deployed Engineering**

I build cloud infrastructure, automate deployments, and develop AI workflows for operational problems. My work ranges from shipping services on AWS EKS to building agents that triage incidents and route invoices for human review.

[Portfolio](https://jithendra-kantharaju.site/) · [LinkedIn](https://www.linkedin.com/in/jithendra-kantharaju/) · [Email](mailto:jithendra.kantharaju@gmail.com)

## Featured projects

### LedgerGuard

**AI-assisted invoice processing with policy checks and human review**

LedgerGuard extracts invoice data, checks for duplicates, and matches invoices against purchase orders and receipts. It routes exceptions for review and records shadow approvals without posting transactions.

- **Evaluation:** Recorded zero incorrect auto-approvals across 144 development cases in shadow mode.
- **Stack:** Python, FastAPI, LangGraph, OpenAI API, PostgreSQL, pgvector

[View the LedgerGuard repository](https://github.com/Jithendra-Kantharaju/ledgerguard)

### Enterprise CloudOps AI Platform

**AWS EKS platform with GitOps delivery and AI-assisted incident triage**

Built and deployed eight services on AWS EKS, including a retrieval-augmented generation (RAG) assistant for operational questions. A LangGraph agent uses CloudWatch, Prometheus, and Kubernetes signals to classify incidents.

- **Delivery:** Reduced deployment time from 45 to 12 minutes using parallel builds in GitHub Actions and GitOps deployment through Argo CD.
- **AI evaluation:** Classified 15 of 16 simulated incidents correctly (93.8%). The RAG assistant handled 21 of 22 refusal test cases correctly (95.5%).
- **Stack:** AWS EKS, ECR, Terraform, GitHub Actions, Helm, Argo CD, LangGraph, FastAPI, ChromaDB

[View the Enterprise CloudOps AI Platform repository](https://github.com/Jithendra-Kantharaju/enterprise-cloudops-ai-platform)

## Experience

- **Face Friends Foundation · Volunteer AI Systems Engineer**  
  Build fundraising workflow integrations across Symphony, Bitrix24, and Wix.
- **Compass Group USA · Technical Operations Analyst**  
  Supported point-of-sale and meal-card systems serving more than 10,000 daily users and coordinated incident triage and vendor patches.
- **Corezeal Technologies · Associate DevOps Engineer**  
  Reduced deployment time by 40% with CI/CD automation and cut manual infrastructure setup by about 70% with Terraform and Ansible.
- **University of South Florida · M.S. in Computer Engineering**

## Technical toolkit

- **Cloud and infrastructure:** AWS, Google Cloud, Kubernetes, Docker, Terraform, Ansible
- **Delivery and reliability:** GitHub Actions, Jenkins, GitLab CI, Helm, Argo CD, Prometheus, Grafana, CloudWatch
- **Applied AI and backend:** Python, FastAPI, LangGraph, RAG, LLM evaluation, PostgreSQL, OpenAI and Anthropic APIs
- **Security:** AWS IAM, HashiCorp Vault, Trivy

---

## GitHub activity

<div align="center">
  <img src="assets/contribution-snake.svg" width="100%" alt="GitHub contribution activity snake" />
  <img src="assets/github-stats.svg" width="100%" alt="GitHub stats and language breakdown" />
</div>

---

## Certifications

- AWS Certified Solutions Architect – Associate
- AWS Certified AI Practitioner
- Google Cloud Associate Cloud Engineer
- Claude Certified Architect – Foundations