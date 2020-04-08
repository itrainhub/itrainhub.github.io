
FROM ruby:latest

RUN gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/

RUN gem install jekyll bundler

COPY . /blog/

RUN bundle config mirror.https://rubygems.org https://gems.ruby-china.com

RUN cd blog \

        && bundler install

WORKDIR /blog

CMD bundle exec jekyll serve --host 0.0.0.0
