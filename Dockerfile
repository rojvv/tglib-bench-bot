FROM denoland/deno

WORKDIR /app

COPY deno.json .
COPY deno.lock .
RUN deno install --frozen

COPY . .

CMD ["deno", "-A", "main.ts"]
