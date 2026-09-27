use std::collections::btree_map::Keys;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug)]
#[allow(unused)]
struct Counter {
    count: u32,
}

#[wasm_bindgen]
#[allow(unused)]
impl Counter {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { count: 0 }
    }

    pub fn increment(&mut self) {
        self.count += 1;
    }

    pub fn value(&self) -> u32 {
        self.count
    }
}

#[wasm_bindgen]
pub struct Ufdb {
    inner: ufodb_v0::Ufdb,
}

#[wasm_bindgen]
impl Ufdb {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            inner: ufodb_v0::Ufdb::new()
        }
    }

    pub fn make_set(&mut self, key: &str) -> bool {
        self.inner.make_set(key)
    }
}

#[wasm_bindgen]
pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
