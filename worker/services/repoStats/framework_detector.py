import json
import os


def detect_frameworks(repo_path):
    technologies = set()

    for root, dirs, files in os.walk(repo_path):

        
        if "package.json" in files:

            package_json_path = os.path.join(
                root,
                "package.json"
            )

            try:
                with open(
                    package_json_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    package_json = json.load(f)

                dependencies = {
                    **package_json.get(
                        "dependencies",
                        {}
                    ),
                    **package_json.get(
                        "devDependencies",
                        {}
                    )
                }

      

                if "react" in dependencies:
                    technologies.add("React")

                if "next" in dependencies:
                    technologies.add("Next.js")

                if "vue" in dependencies:
                    technologies.add("Vue.js")

                if "@angular/core" in dependencies:
                    technologies.add("Angular")

                if "svelte" in dependencies:
                    technologies.add("Svelte")

                if "vite" in dependencies:
                    technologies.add("Vite")

                if "webpack" in dependencies:
                    technologies.add("Webpack")

                if "tailwindcss" in dependencies:
                    technologies.add("Tailwind CSS")

                if "@mui/material" in dependencies:
                    technologies.add("Material UI")

                if "bootstrap" in dependencies:
                    technologies.add("Bootstrap")


                if "express" in dependencies:
                    technologies.add("Express")

                if "@nestjs/core" in dependencies:
                    technologies.add("NestJS")

                if "koa" in dependencies:
                    technologies.add("Koa")

                if "fastify" in dependencies:
                    technologies.add("Fastify")

                if "socket.io" in dependencies:
                    technologies.add("Socket.IO")

                

                if "mongoose" in dependencies:
                    technologies.add("MongoDB")

                if "mongodb" in dependencies:
                    technologies.add("MongoDB")

                if "pg" in dependencies:
                    technologies.add("PostgreSQL")

                if "mysql" in dependencies:
                    technologies.add("MySQL")

                if "mysql2" in dependencies:
                    technologies.add("MySQL")

                if "redis" in dependencies:
                    technologies.add("Redis")

                # ORM

                if "prisma" in dependencies:
                    technologies.add("Prisma")

                if "sequelize" in dependencies:
                    technologies.add("Sequelize")

                if "typeorm" in dependencies:
                    technologies.add("TypeORM")

            except Exception:
                pass

        
        if "requirements.txt" in files:

            requirements_path = os.path.join(
                root,
                "requirements.txt"
            )

            try:
                with open(
                    requirements_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    content = f.read().lower()

                if "django" in content:
                    technologies.add("Django")

                if "fastapi" in content:
                    technologies.add("FastAPI")

                if "flask" in content:
                    technologies.add("Flask")

                if "sqlalchemy" in content:
                    technologies.add("SQLAlchemy")

                if "psycopg2" in content:
                    technologies.add("PostgreSQL")

                if "pymongo" in content:
                    technologies.add("MongoDB")

                if "redis" in content:
                    technologies.add("Redis")

            except Exception:
                pass

        
        if "pyproject.toml" in files:

            pyproject_path = os.path.join(
                root,
                "pyproject.toml"
            )

            try:
                with open(
                    pyproject_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    content = f.read().lower()

                if "fastapi" in content:
                    technologies.add("FastAPI")

                if "django" in content:
                    technologies.add("Django")

                if "flask" in content:
                    technologies.add("Flask")

                if "sqlalchemy" in content:
                    technologies.add("SQLAlchemy")

            except Exception:
                pass

        
        if "go.mod" in files:

            go_mod_path = os.path.join(
                root,
                "go.mod"
            )

            try:
                with open(
                    go_mod_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    content = f.read()

                if "gin-gonic/gin" in content:
                    technologies.add("Gin")

                if "gofiber/fiber" in content:
                    technologies.add("Fiber")

                if "gorm.io/gorm" in content:
                    technologies.add("GORM")

            except Exception:
                pass

       
        if "pom.xml" in files:

            pom_xml_path = os.path.join(
                root,
                "pom.xml"
            )

            try:
                with open(
                    pom_xml_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    content = f.read().lower()

                if "spring-boot" in content:
                    technologies.add("Spring Boot")

                if "hibernate" in content:
                    technologies.add("Hibernate")

            except Exception:
                pass

        
        if "build.gradle" in files:

            gradle_path = os.path.join(
                root,
                "build.gradle"
            )

            try:
                with open(
                    gradle_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    content = f.read().lower()

                if "spring-boot" in content:
                    technologies.add("Spring Boot")

            except Exception:
                pass

        
        if "composer.json" in files:

            composer_path = os.path.join(
                root,
                "composer.json"
            )

            try:
                with open(
                    composer_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    content = f.read().lower()

                if "laravel" in content:
                    technologies.add("Laravel")

                if "symfony" in content:
                    technologies.add("Symfony")

            except Exception:
                pass

        
        if "Cargo.toml" in files:

            cargo_path = os.path.join(
                root,
                "Cargo.toml"
            )

            try:
                with open(
                    cargo_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    content = f.read().lower()

                if "actix-web" in content:
                    technologies.add("Actix")

                if "rocket" in content:
                    technologies.add("Rocket")

            except Exception:
                pass

    return sorted(list(technologies))