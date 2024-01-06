import networkx as nx
import matplotlib.pyplot as plt
import pandas as pd
from readchar import readkey, key

def user_filter(current, second_syllables):
    second_syllables_filtered = []
    force_stop = False

    for second_syllable in second_syllables:

        repeat = True
        while repeat:
            repeat = False
            print(f"Utilizar a palavra '{current}{second_syllable}'? (s/n/ESC) ")
            k = readkey()

            if k == key.ESC:
                force_stop = True
            elif k == 's' or k == 'S':
                second_syllables_filtered.append(second_syllable)
            elif not (k == 'n' or k == 'N'):
                print("Resposta inválida, utilize as teclas 's', 'n' ou ESC")
                repeat = True
        
        if force_stop:
            break
    
    return second_syllables_filtered, force_stop

G = nx.DiGraph()

df = pd.read_csv('./filter_two-syllable.csv', sep=',')

inicio = input("Escreva a sílaba inicial: ")
first_syllable_stack = [inicio]

force_stop = False

while len(first_syllable_stack) != 0 and not force_stop:
    print("stack size:", len(first_syllable_stack))
    current = first_syllable_stack.pop()

    filtered_df = df[df['syllable1'] == current]
    second_syllables = list(set(filtered_df['syllable2'].values))

    second_syllables, force_stop = user_filter(current, second_syllables)

    first_syllable_stack.extend(element for element in second_syllables if (element not in G and element not in first_syllable_stack and element != current))

    for second_syllable in second_syllables:
        G.add_edge(current, second_syllable)

# pos = nx.nx_agraph.graphviz_layout(G)

nx.draw_networkx(G)
plt.show()
