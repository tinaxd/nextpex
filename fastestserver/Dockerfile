FROM rust:latest AS builder

WORKDIR /usr/src
RUN cargo new app
COPY Cargo.toml Cargo.lock /usr/src/app/

WORKDIR /usr/src/app
RUN cargo build --release

COPY . .
RUN touch /usr/src/app/src/main.rs

RUN cargo build --release

# prod
FROM debian:latest

COPY --from=builder /usr/src/app/target/release/fastestserver /usr/local/bin/fastestserver

EXPOSE 9000
CMD ["fastestserver"]
